import { BigNumberish } from 'ethers';
import { difference, range, uniq } from 'lodash';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

import { UniswapV2PoolOnChainTemplateTokenFetcher } from './uniswap-v2.pool.on-chain.template.token-fetcher';
import { DEFAULT_POOLS_BY_ID_QUERY, DEFAULT_POOLS_QUERY, PoolsResponse } from './uniswap-v2.pool.subgraph.types';

export abstract class UniswapV2PoolSubgraphTemplateTokenFetcher<
  T extends Abi,
> extends UniswapV2PoolOnChainTemplateTokenFetcher<T, any> {
  abstract subgraphUrl: string;

  // Pool Addresses
  first = 1000;
  orderBy = 'reserveUSD';
  poolsQuery = DEFAULT_POOLS_QUERY;
  poolsByIdQuery = DEFAULT_POOLS_BY_ID_QUERY;
  requiredPools: string[] = [];
  ignoredPools: string[] = [];

  async getAddresses() {
    const chunks = await Promise.all(
      range(0, this.first, 1000).map(skip => {
        const count = Math.min(1000, this.first - skip);
        return gqlFetch<PoolsResponse>({
          endpoint: this.subgraphUrl,
          query: this.poolsQuery,
          variables: { first: count, skip, orderBy: this.orderBy },
        });
      }),
    );

    const poolsData = chunks.flat();
    const poolsByIdData = await gqlFetch<PoolsResponse>({
      endpoint: this.subgraphUrl,
      query: this.poolsByIdQuery,
      variables: { ids: this.requiredPools },
    });

    const pools = poolsData.map(v => v.pairs ?? []).flat();
    const poolsById = poolsByIdData.pairs ?? [];

    const poolIds = [...pools, ...poolsById].map(v => v.id.toLowerCase());
    const uniquePoolIds = uniq(poolIds);
    const filteredPoolIds = difference(uniquePoolIds, this.ignoredPools);

    return filteredPoolIds;
  }

  getPoolFactoryContract(_address: string): GetContractReturnType<any, PublicClient> {
    throw new Error('Method not implemented.');
  }

  getPoolsLength(_contract: any): Promise<BigNumberish> {
    throw new Error('Method not implemented.');
  }

  getPoolAddress(_contract: any, _index: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
