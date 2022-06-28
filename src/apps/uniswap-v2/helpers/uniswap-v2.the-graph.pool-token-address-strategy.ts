import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

const DEFAULT_POOLS_QUERY = gql`
  query getPools($first: Int, $skip: Int, $orderBy: Pair_orderBy) {
    pairs(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: desc) {
      id
    }
  }
`;

const DEFAULT_POOLS_BY_ID_QUERY = gql`
  query getPoolsById($ids: [ID!]) {
    pairs(where: { id_in: $ids }) {
      id
    }
  }
`;

type PoolsResponse = {
  pairs?: {
    id: string;
  }[];
};

type UniswapV2TheGraphPoolTokenAddressStrategyParams = {
  subgraphUrl: string;
  first: number;
  orderBy?: string;
  requiredPools?: string[];
  poolsQuery?: string;
  poolsByIdQuery?: string;
};

@Injectable()
export class UniswapV2TheGraphPoolTokenAddressStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: (subgraphUrl: string) => {
      const [namespace, name] = subgraphUrl.split('/').slice(-2);
      return `studio:uniswap-v2-fork:pool-token-addresses:${namespace}:${name}`;
    },
    ttl: 5 * 60,
  })
  async getPoolAddresses(
    subgraphUrl: string,
    first: number,
    orderBy: string,
    requiredPools: string[],
    poolsQuery: string,
    poolsByIdQuery: string,
  ) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const chunks = await Promise.all(
      range(0, first, 1000).map(skip => {
        const count = Math.min(1000, first - skip);
        return graphHelper.request<PoolsResponse>({
          endpoint: subgraphUrl,
          query: poolsQuery,
          variables: { first: count, skip, orderBy },
        });
      }),
    );

    const poolsData = chunks.flat();
    const poolsByIdData = await graphHelper.request<PoolsResponse>({
      endpoint: subgraphUrl,
      query: poolsByIdQuery,
      variables: { ids: requiredPools },
    });

    const pools = poolsData.map(v => v.pairs ?? []).flat();
    const poolsById = poolsByIdData.pairs ?? [];

    const poolIds = [...pools, ...poolsById].map(v => v.id.toLowerCase());
    const uniquepoolIds = uniq(poolIds);
    return uniquepoolIds;
  }

  build<T = UniswapFactory, V = UniswapPair>({
    subgraphUrl,
    first,
    orderBy = 'reserveUSD',
    requiredPools = [],
    poolsQuery = DEFAULT_POOLS_QUERY,
    poolsByIdQuery = DEFAULT_POOLS_BY_ID_QUERY,
  }: UniswapV2TheGraphPoolTokenAddressStrategyParams): UniswapV2PoolTokenHelperParams<
    T,
    V
  >['resolvePoolTokenAddresses'] {
    return () => this.getPoolAddresses(subgraphUrl, first, orderBy, requiredPools, poolsQuery, poolsByIdQuery);
  }
}
