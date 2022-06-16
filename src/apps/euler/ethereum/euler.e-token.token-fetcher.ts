import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EulerContractFactory } from '~apps/euler';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';
import {BigNumber, utils} from "ethers";

const appId = EULER_DEFINITION.id;
const groupId = EULER_DEFINITION.groups.eToken.id;
const network = Network.ETHEREUM_MAINNET;

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        id
        interestRate
        borrowAPY
        supplyAPY
        twap
        name
        symbol
        decimals
        eTokenAddress
        totalBalances
      }
    }
  }
`;

interface EulerMarket {
  id: string;
  interestRate: string;
  borrowAPY: string;
  supplyAPY: string;
  twap: string;
  name: string;
  symbol: string;
  decimals: string;
  eTokenAddress: string;
  totalBalances: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEulerETokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) private readonly eulerContractFactory: EulerContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async market => {
        if (market.eTokenAddress === ZERO_ADDRESS) return null;

        const eTokenContract = this.eulerContractFactory.eulerEtokenContract({
          address: market.eTokenAddress,
          network,
        });

        const totalSupply = await eTokenContract.totalSupply();
        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());

        if (totalSupply.isZero() || !underlyingToken) return null;

        const pricePerShare = await eTokenContract.convertBalanceToUnderlying(utils.parseEther('1'));

        const dataProps = {
          name: market.name,
          liquidity: Number(totalSupply) * underlyingToken.price,
          underlyingAddress: market.id,
          interestRate: Number(market.interestRate) / 10 ** 18,
          supplyAPY: Number(market.supplyAPY) * 100 / 1e27,
          totalSupply: totalSupply.toString(),
          totalBalances: market.totalBalances,
        };

        return {
          address: market.eTokenAddress,
          symbol: `E${market.symbol}`,
          name: market.name,
          type: ContractType.APP_TOKEN as const,
          supply: Number(market.totalBalances) / 10 ** Number(market.decimals),
          pricePerShare: underlyingToken.price * Number(utils.formatEther(pricePerShare)),
          price: underlyingToken.price,
          network,
          decimals: 18,
          tokens: [underlyingToken],
          dataProps,
          displayProps: {
            label: market.name,
            secondaryLabel: buildDollarDisplayItem(underlyingToken.price * Number(utils.formatEther(pricePerShare))),
            images: getImagesFromToken(underlyingToken),
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(dataProps.liquidity),
              },
              {
                label: 'Supply APY',
                value: dataProps.supplyAPY,
              },
            ],
          },
          appId,
          groupId,
        };
      }),
    );

    return compact(tokens);
  }
}
