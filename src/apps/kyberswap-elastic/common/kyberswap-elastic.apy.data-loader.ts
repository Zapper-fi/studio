import DataLoader from 'dataloader';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';

import { getTimeDayAgo } from './kyberswap-elastic.liquidity.utils';
import { GET_BLOCKS, POOLS_FEE_HISTORY } from './kyberswap-elastic.pool.subgraph.types';

export type GetBlockOneDayAgoResponse = {
  blocks: {
    number: number;
  }[];
};

export type PoolsFeeResponse = {
  pools?: {
    id: string;
    feesUSD: string;
  }[];
};

type GetPoolInfoResponse = {
  pools: {
    id: string;
    feesUSD: number;
    totalValueLockedUSD: number;
  }[];
};

export const GET_POOL_INFOS = gql`
  query getPoolInfos($ids: [String]!) {
    pools(where: { id_in: $ids }) {
      id
      feesUSD
      totalValueLockedUSD
    }
  }
`;

export class KyberswapElasticApyDataLoader {
  getLoader({ subgraphUrl, blockSubgraphUrl }: { subgraphUrl: string; blockSubgraphUrl: string }) {
    const dataLoaderOptions = { cache: true, maxBatchSize: 1000 };
    return new DataLoader<string, number>(async (addresses: string[]) => {
      // Get block from 24h ago
      const response = await gqlFetch<GetBlockOneDayAgoResponse>({
        query: GET_BLOCKS([getTimeDayAgo()]),
        endpoint: blockSubgraphUrl,
      });

      const blockNumberOneDayAgo = Number(response.blocks[0].number);

      // Get pool stats
      const poolStatsResponse = await gqlFetch<GetPoolInfoResponse>({
        endpoint: subgraphUrl,
        query: GET_POOL_INFOS,
        variables: {
          ids: addresses,
        },
      });

      const poolStatsMap = _.chain(poolStatsResponse.pools ?? [])
        .keyBy(v => v.id)
        .mapValues(v => ({ feesUSD: v.feesUSD, tvl: v.totalValueLockedUSD }))
        .value();

      // Get fees
      const poolsFeeResponse = await gqlFetch<PoolsFeeResponse>({
        endpoint: subgraphUrl,
        query: POOLS_FEE_HISTORY,
        variables: { block: blockNumberOneDayAgo },
      });

      const poolFeesMap = _.chain(poolsFeeResponse.pools ?? [])
        .keyBy(v => v.id)
        .mapValues(v => Number(v.feesUSD))
        .value();

      return addresses.map(address => {
        const poolStats = poolStatsMap[address];
        const poolFees = poolFeesMap[address];

        if (poolStats?.feesUSD > 0 && poolStats?.tvl > 0 && poolFees > 0) {
          const pool24hFee = poolStats.feesUSD - poolFees;
          return (pool24hFee * 100 * 365) / poolStats.tvl;
        }

        return 0;
      });
    }, dataLoaderOptions);
  }
}
