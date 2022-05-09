import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type PoolsResponse = {
  pools: {
    address: string;
    totalLiquidity: string;
    volume24h: string;
  }[];
};

const DEFAULT_POOLS_QUERY = gql`
  {
    pools {
      address
      totalLiquidity
      volume24h
    }
  }
`;

type BeethovenXTheGraphPoolTokenDataStrategyParams = {
  subgraphUrl: string;
  minLiquidity?: number;
  poolsQuery?: string;
};

@Injectable()
export class BeethovenXTheGraphPoolTokenDataStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio-beethoven-x-events-pool-token-addresses:${network}:beethoven-x`,
    ttl: 5 * 60,
  })
  async getPoolAddresses(subgraphUrl: string, minLiquidity: number, poolsQuery: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const poolsResponse = await graphHelper.request<PoolsResponse>({
      endpoint: subgraphUrl,
      query: poolsQuery,
      variables: {},
      headers: { 'Content-Type': 'application/json' },
    });

    return poolsResponse.pools
      .filter(v => Number(v.totalLiquidity) > minLiquidity)
      .map(v => ({
        address: v.address,
        volume: Number(v.volume24h),
      }));
  }

  build({
    subgraphUrl,
    minLiquidity = 0,
    poolsQuery = DEFAULT_POOLS_QUERY,
  }: BeethovenXTheGraphPoolTokenDataStrategyParams) {
    return async () => {
      const poolAddresses = await this.getPoolAddresses(subgraphUrl, minLiquidity, poolsQuery);

      return poolAddresses;
    };
  }
}
