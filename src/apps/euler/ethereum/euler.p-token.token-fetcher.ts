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
const groupId = EULER_DEFINITION.groups.pToken.id;
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
        pTokenAddress
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
  pTokenAddress: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEulerPTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
        if (market.pTokenAddress === ZERO_ADDRESS) return null;

        const pTokenContract = this.eulerContractFactory.eulerPtokenContract({
          address: market.pTokenAddress,
          network,
        });

        const totalSupply = await pTokenContract.totalSupply();
        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());

        if (totalSupply.isZero() || !underlyingToken) return null;

        const dataProps = {
          name: market.name,
          liquidity: Number(totalSupply) * underlyingToken.price,
          interestRate: Number(market.interestRate) / 10 ** 18,
          borrowAPY: Number(market.borrowAPY) / 10 ** 18,
          supplyAPY: Number(market.borrowAPY) / 10 ** 18,
        };

        return {
          address: market.pTokenAddress,
          symbol: `P${market.symbol}`,
          name: `Euler P token ${market.name}`,
          type: ContractType.APP_TOKEN as const,
          supply: Number(market.totalSupply) / 10 ** Number(market.decimals),
          pricePerShare: 1,
          price: underlyingToken.price,
          network,
          decimals: 18,
          tokens: [underlyingToken],
          dataProps,
          displayProps: {
            label: `Euler P token ${market.name}`,
            secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
            images: getImagesFromToken(underlyingToken),
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(dataProps.liquidity),
              },
              {
                label: 'Borrow APY',
                value: buildDollarDisplayItem(dataProps.borrowAPY),
              },
              {
                label: 'Supply APY',
                value: buildDollarDisplayItem(dataProps.supplyAPY),
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
