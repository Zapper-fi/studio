import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
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

enum Contracts {
  GeneralView = '0xACC25c4d40651676FEEd43a3467F3169e3E68e42',
  Euler = '0x27182842E098f60e3D576794A5bFFb0777E025d3',
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

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async (market, i) => {
        const eTokenContract = this.eulerContractFactory.eulerEtokenContract({
          address: market.eTokenAddress,
          network,
        });

        const totalSupply = await eTokenContract.totalSupply();
        if (totalSupply.isZero()) return null;

        const ratio = Number(totalSupply.toString()) / Number(market.totalBalances);

        return {
          address: market.eTokenAddress,
          symbol: `E${market.symbol}`,
          name: `Euler E token ${market.name}`,
          type: ContractType.APP_TOKEN as const,
          supply: Number(market.totalSupply) / 10 ** Number(market.decimals),
          pricePerShare: (Number(market.twap) / 10 ** 18) * ratio,
          price: Number(market.twap) / 10 ** 18,
          network,
          decimals: 18,
          tokens: [
            {
              type: ContractType.BASE_TOKEN as const,
              address: market.id,
              symbol: market.symbol,
              name: market.name,
              price: Number(market.twap) / 10 ** 18,
              network,
              decimals: Number(market.decimals),
            },
          ],
          dataProps: {
            name: `Euler E token ${market.name}`,
            underlyingAddress: market.id,
            interestRate: Number(market.interestRate) / 10 ** 18,
            borrowAPY: Number(market.borrowAPY) / 10 ** 18,
            supplyAPY: Number(market.borrowAPY) / 10 ** 18,
            totalSupply: totalSupply.toString(),
            totalBalances: market.totalBalances,
          },
          displayProps: { label: market.name, images: [''] },
          appId,
          groupId,
        };
      }),
    );

    return compact(tokens);
  }
}
