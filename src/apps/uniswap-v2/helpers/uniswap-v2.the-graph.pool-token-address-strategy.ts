import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

const DEFAULT_POOLS_QUERY = gql`
  query getPools($first: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveUSD, orderDirection: desc) {
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
  requiredPools?: string[];
  poolsQuery?: string;
  poolsByIdQuery?: string;
};

@Injectable()
export class UniswapV2TheGraphPoolTokenAddressStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio-uniswap-v2-the-graph-pool-token-addresses:${network}:uniswap-v2`,
    ttl: 5 * 60,
  })
  async getPoolAddresses(
    subgraphUrl: string,
    first: number,
    requiredPools: string[],
    poolsQuery: string,
    poolsByIdQuery: string,
  ) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const [poolsData, poolsByIdData] = await Promise.all([
      graphHelper.request<PoolsResponse>({ endpoint: subgraphUrl, query: poolsQuery, variables: { first } }),
      graphHelper.request<PoolsResponse>({
        endpoint: subgraphUrl,
        query: poolsByIdQuery,
        variables: { ids: requiredPools },
      }),
    ]);

    const pools = poolsData.pairs ?? [];
    const poolsById = poolsByIdData.pairs ?? [];
    const poolIds = [...pools, ...poolsById].map(v => v.id.toLowerCase());
    const uniquepoolIds = uniq(poolIds);
    return uniquepoolIds;
  }

  build<T = UniswapFactory, V = UniswapPair>({
    subgraphUrl,
    first,
    requiredPools = [],
    poolsQuery = DEFAULT_POOLS_QUERY,
    poolsByIdQuery = DEFAULT_POOLS_BY_ID_QUERY,
  }: UniswapV2TheGraphPoolTokenAddressStrategyParams): UniswapV2PoolTokenHelperParams<
    T,
    V
  >['resolvePoolTokenAddresses'] {
    return async () => {
      const poolAddresses = this.getPoolAddresses(subgraphUrl, first, requiredPools, poolsQuery, poolsByIdQuery);

      return poolAddresses;
    };
  }
}
