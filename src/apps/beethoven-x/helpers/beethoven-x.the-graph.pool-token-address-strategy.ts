import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PoolType } from '~apps/balancer-v2/helpers/balancer-v2.pool-types';
import { Cache } from '~cache/cache.decorator';

type PoolsResponse = {
  pools: {
    address: string;
    totalLiquidity: string;
    volume24h: string;
    poolType: PoolType;
  }[];
};

const DEFAULT_POOLS_QUERY = gql`
  {
    pools {
      address
      totalLiquidity
      volume24h
      poolType
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
    key: (subgraphUrl: string) => {
      const [namespace, name] = subgraphUrl.split('/').slice(-2);
      return `studio:beethoven-x-fork:pool-token-addresses:${namespace}:${name}`;
    },
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
        poolType: v.poolType,
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
