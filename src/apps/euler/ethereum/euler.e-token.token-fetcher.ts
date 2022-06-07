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
        totalSupply
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
  totalSupply: string;
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

        const pricePerShare = Number(totalSupply.toString()) / Number(market.totalBalances);

        const liquidity = Number(totalSupply) * pricePerShare;

        return {
          address: market.eTokenAddress,
          symbol: `E${market.symbol}`,
          name: `Euler E token ${market.name}`,
          type: ContractType.APP_TOKEN as const,
          supply: Number(market.totalSupply) / 10 ** Number(market.decimals),
          pricePerShare,
          price: underlyingToken.price,
          network,
          decimals: 18,
          tokens: [underlyingToken],
          dataProps: {
            name: `Euler E token ${market.name}`,
            underlyingAddress: market.id,
            interestRate: Number(market.interestRate) / 10 ** 18,
            borrowAPY: Number(market.borrowAPY) / 10 ** 18,
            supplyAPY: Number(market.borrowAPY) / 10 ** 18,
            totalSupply: totalSupply.toString(),
            totalBalances: market.totalBalances,
          },
          displayProps: {
            label: `Euler E token ${market.name}`,
            secondaryLabel: buildDollarDisplayItem(pricePerShare),
            images: getImagesFromToken(underlyingToken),
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
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
