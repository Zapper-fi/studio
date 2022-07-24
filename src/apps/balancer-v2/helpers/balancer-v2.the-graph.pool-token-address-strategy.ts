import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { PoolType } from './balancer-v2.pool-types';

type GetPoolsResponse = {
  pools: {
    address: string;
    poolType: PoolType;
    swapFee: string;
    tokensList: string;
    totalLiquidity: string;
    totalSwapVolume: string;
    totalSwapFee: string;
    totalShares: string;
    tokens: {
      address: string;
      symbol: string;
      decimals: number;
      balance: string;
      weight: string;
    }[];
  }[];
};

const DEFAULT_GET_CURRENT_POOLS_QUERY = gql`
  query getPools($minLiquidity: Int) {
    pools(
      first: 250
      skip: 0
      orderBy: totalLiquidity
      orderDirection: desc
      where: { totalShares_gt: 0.01, totalLiquidity_gt: $minLiquidity }
    ) {
      address
      poolType
      swapFee
      tokensList
      totalLiquidity
      totalSwapVolume
      totalSwapFee
      totalShares
      tokens {
        address
        symbol
        decimals
        balance
        weight
      }
    }
  }
`;

const DEFAULT_GET_PAST_POOLS_QUERY = gql`
  query getPools($minLiquidity: Int, $blockYesterday: Int) {
    pools(
      first: 250
      skip: 0
      orderBy: totalLiquidity
      orderDirection: desc
      where: { totalShares_gt: 0.01, totalLiquidity_gt: $minLiquidity }
      block: { number: $blockYesterday }
    ) {
      address
      poolType
      swapFee
      tokensList
      totalLiquidity
      totalSwapVolume
      totalSwapFee
      totalShares
      tokens {
        address
        symbol
        decimals
        balance
        weight
      }
    }
  }
`;

type BalancerV2TheGraphPoolTokenDataStrategyParams = {
  subgraphUrl: string;
  minLiquidity?: number;
  currentPoolsQuery?: string;
  pastPoolsQuery?: string;
  skipVolume?: boolean;
};

@Injectable()
export class BalancerV2TheGraphPoolTokenDataStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: (subgraphUrl: string) => {
      const [namespace, name] = subgraphUrl.split('/').slice(-2);
      return `studio:balancer-v2-fork:pool-token-addresses:${namespace}:${name}:1`;
    },
    ttl: 5 * 60,
  })
  async getPoolAddresses(
    subgraphUrl: string,
    minLiquidity: number,
    currentPoolsQuery: string,
    pastPoolsQuery: string,
    network: Network,
    skipVolume: boolean,
  ) {
    const provider = this.appToolkit.getNetworkProvider(network);
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const blockToday = await provider.getBlockNumber();
    const blockYesterday = blockToday - BLOCKS_PER_DAY[network];

    const currentPoolsResponse = await graphHelper.request<GetPoolsResponse>({
      endpoint: subgraphUrl,
      query: currentPoolsQuery,
      variables: {
        minLiquidity,
      },
    });

    let pastPoolsResponse = { pools: [] } as GetPoolsResponse;
    if (!skipVolume) {
      pastPoolsResponse = await graphHelper.request<GetPoolsResponse>({
        endpoint: subgraphUrl,
        query: pastPoolsQuery,
        variables: {
          blockYesterday,
          minLiquidity,
        },
      });
    }

    return currentPoolsResponse.pools.map(pool => {
      const pastPool = pastPoolsResponse.pools.find(p => p.address === pool.address);
      const volume = pastPool ? Number(pool.totalSwapVolume) - Number(pastPool.totalSwapVolume) : 0;
      return { address: pool.address, poolType: pool.poolType, volume };
    });
  }

  build({
    subgraphUrl,
    minLiquidity = 0,
    currentPoolsQuery = DEFAULT_GET_CURRENT_POOLS_QUERY,
    pastPoolsQuery = DEFAULT_GET_PAST_POOLS_QUERY,
    skipVolume = false,
  }: BalancerV2TheGraphPoolTokenDataStrategyParams) {
    return async ({ network }: { network: Network }) => {
      const poolAddresses = await this.getPoolAddresses(
        subgraphUrl,
        minLiquidity,
        currentPoolsQuery,
        pastPoolsQuery,
        network,
        skipVolume,
      );

      return poolAddresses;
    };
  }
}
