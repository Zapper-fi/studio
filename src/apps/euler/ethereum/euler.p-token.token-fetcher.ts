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

type EulerTokenDataProps = {
  liquidity: number;
  interestRate: number;
  borrowAPY: number;
  supplyAPY: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumEulerPTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) private readonly eulerContractFactory: EulerContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async market => {
        if (market.pTokenAddress === ZERO_ADDRESS) return null;
        const pTokenContract = this.eulerContractFactory.eulerPtokenContract({
          address: market.pTokenAddress,
          network,
        });

        const [totalSupplyRaw, decimals] = await Promise.all([
          multicall.wrap(pTokenContract).totalSupply(),
          multicall.wrap(pTokenContract).decimals(),
        ]);
        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());
        if (totalSupplyRaw.isZero() || !underlyingToken) return null;

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const symbol = `P${market.symbol}`;
        const price = underlyingToken.price;
        const pricePerShare = 1;
        const liquidity = supply * underlyingToken.price;
        const interestRate = Number(market.interestRate) / 10 ** decimals;

        const dataProps = {
          liquidity,
          interestRate,
        };

        const statsItems = [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(dataProps.liquidity),
          },
        ];

        const displayProps = {
          label: `${market.name} (P)`,
          secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
          images: getImagesFromToken(underlyingToken),
          statsItems,
        };

        return {
          type: ContractType.APP_TOKEN as const,
          address: market.pTokenAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens: [underlyingToken],
          dataProps,
          displayProps,
        };
      }),
    );

    return compact(tokens);
  }
}
