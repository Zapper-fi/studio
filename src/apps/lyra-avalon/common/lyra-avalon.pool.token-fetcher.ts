import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { LyraAvalonViemContractFactory } from '../contracts';
import { LyraLiquidityToken } from '../contracts/viem';

// TODO: find better way to determine available markets
type QueryResponse = {
  markets: {
    id: string;
    baseAddress: string;
    quoteAddress: string;
    liquidityPool: {
      id: string;
    };
  }[];
};
const QUERY = gql`
  {
    markets(where: { isRemoved: false }) {
      id
      baseAddress
      quoteAddress
      liquidityPool {
        id
      }
    }
  }
`;

export abstract class LyraAvalonPoolTokenFetcher extends AppTokenTemplatePositionFetcher<LyraLiquidityToken> {
  groupLabel = 'Pools';

  abstract subgraphUrl: string;
  abstract registryContractAddress: string;
  abstract underlyingContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonViemContractFactory) protected readonly contractFactory: LyraAvalonViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.lyraLiquidityToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const registryContract = this.contractFactory.lyraRegistry({
      address: this.registryContractAddress,
      network: this.network,
    });

    const marketsResponse = await gqlFetch<QueryResponse>({
      endpoint: this.subgraphUrl,
      query: QUERY,
    });

    const markets = await Promise.all(
      marketsResponse.markets.map(market => multicall.wrap(registryContract).read.marketAddresses([market.id])),
    );

    return markets.map(market => market[1]);
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: this.underlyingContractAddress, network: this.network }];
  }

  async getPricePerShare({
    contract,
    multicall,
  }: GetPricePerShareParams<LyraLiquidityToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const pool = await contract.read.liquidityPool();
    const poolContract = this.contractFactory.lyraLiquidityPool({ address: pool, network: this.network });
    const ratioRaw = await multicall.wrap(poolContract).read.getTokenPrice();
    const ratio = Number(ratioRaw) / 10 ** 18;

    return [ratio];
  }
}
