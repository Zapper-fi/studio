import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { uniqBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

type LastBlockSyncedResponse = {
  _meta: {
    block: {
      number: number;
    };
  };
};

type PoolVolumesResponse = {
  pairs: {
    id: string;
    volumeUSD: string;
    untrackedVolumeUSD: string;
  }[];
};

type SinglePoolVolumeResponse = {
  pair: {
    id: string;
    volumeUSD: string;
    untrackedVolumeUSD: string;
  };
};

const DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY = gql`
  {
    _meta {
      block {
        number
      }
    }
  }
`;

// @TODO where: { reserveUSD_gte: $minLiquidity }
const DEFAULT_POOL_VOLUMES_QUERY = gql`
  query getCurrentPairVolumes($first: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveUSD, orderDirection: desc) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const DEFAULT_POOL_VOLUMES_AT_BLOCK_QUERY = gql`
  query getCurrentPairVolumes($first: Int, $block: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveUSD, orderDirection: desc, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const DEFAULT_POOL_VOLUMES_BY_ID_QUERY = gql`
  query getPastPairVolumesByID($ids: [String]) {
    pairs(where: { id_in: $ids }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY = gql`
  query getPastPairVolumesByID($ids: [String], $block: Int) {
    pairs(where: { id_in: $ids }, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const DEFAULT_SINGLE_POOL_VOLUME_AT_BLOCK_QUERY = gql`
  query getSinglePairVolume($id: String, $block: Int) {
    pair(id: $id, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

type UniswapV2TheGraphPoolVolumeStrategyParams = {
  subgraphUrl: string;
  first: number;
  blocksPerDay?: number;
  requiredPools?: string[];
  lastBlockSyncedOnGraphQuery?: string;
  poolVolumesQuery?: string;
  poolVolumesAtBlockQuery?: string;
  poolVolumesByIdQuery?: string;
  poolVolumesByIdAtBlockQuery?: string;
  singlePoolVolumeAtBlockQuery?: string;
};

@Injectable()
export class UniswapV2TheGraphPoolVolumeStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  build<T = UniswapFactory, V = UniswapPair>({
    subgraphUrl,
    first,
    blocksPerDay = 0,
    requiredPools = [],
    lastBlockSyncedOnGraphQuery = DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY,
    poolVolumesQuery = DEFAULT_POOL_VOLUMES_QUERY,
    poolVolumesAtBlockQuery = DEFAULT_POOL_VOLUMES_AT_BLOCK_QUERY,
    poolVolumesByIdQuery = DEFAULT_POOL_VOLUMES_BY_ID_QUERY,
    poolVolumesByIdAtBlockQuery = DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY,
    singlePoolVolumeAtBlockQuery = DEFAULT_SINGLE_POOL_VOLUME_AT_BLOCK_QUERY,
  }: UniswapV2TheGraphPoolVolumeStrategyParams): UniswapV2PoolTokenHelperParams<T, V>['resolvePoolVolumes'] {
    return async ({ network }) => {
      // Get block from 1 day ago
      const provider = this.appToolkit.getNetworkProvider(network);
      const block = await provider.getBlockNumber();
      const block1DayAgo = block - (blocksPerDay ?? BLOCKS_PER_DAY[network]);

      const graphHelper = this.appToolkit.helpers.theGraphHelper;

      // Get last block synced on graph; if the graph is not caught up to yesterday, exit early
      const graphMetaData = await graphHelper.request<LastBlockSyncedResponse>({
        endpoint: subgraphUrl,
        query: lastBlockSyncedOnGraphQuery,
      });

      const blockNumberLastSynced = graphMetaData._meta.block.number;
      if (block1DayAgo > blockNumberLastSynced) return [];

      // Retrieve volume data from TheGraph (@TODO Cache this)
      const [volumeData, volumeData1DayAgo, volumeByIDData, volumeByIDData1DayAgo] = await Promise.all([
        graphHelper.request<PoolVolumesResponse>({
          endpoint: subgraphUrl,
          query: poolVolumesQuery,
          variables: { first },
        }),
        graphHelper.request<PoolVolumesResponse>({
          endpoint: subgraphUrl,
          query: poolVolumesAtBlockQuery,
          variables: { first, block: block1DayAgo },
        }),
        graphHelper.request<PoolVolumesResponse>({
          endpoint: subgraphUrl,
          query: poolVolumesByIdQuery,
          variables: { ids: requiredPools },
        }),
        graphHelper.request<PoolVolumesResponse>({
          endpoint: subgraphUrl,
          query: poolVolumesByIdAtBlockQuery,
          variables: { ids: requiredPools, block: block1DayAgo },
        }),
      ]);

      // Merge all volume data for today and merge all volume data for yesterday
      const allVolumeData = uniqBy([...volumeData.pairs, ...volumeByIDData.pairs], p => p.id);
      const allVolumeData1DayAgo = uniqBy([...volumeData1DayAgo.pairs, ...volumeByIDData1DayAgo.pairs], p => p.id);

      const poolVolumes = await Promise.all(
        allVolumeData.map(async pairVolumeToday => {
          // Find the matching volume entry from yesterday
          let poolVolumeYesterday = allVolumeData1DayAgo.find(p => p.id === pairVolumeToday.id);

          // Some pairs move in and out of the top requested pairs, so retrieve the missing pair-volumes by ID individually
          if (!poolVolumeYesterday) {
            poolVolumeYesterday = await graphHelper
              .request<SinglePoolVolumeResponse>({
                endpoint: subgraphUrl,
                query: singlePoolVolumeAtBlockQuery,
                variables: {
                  id: pairVolumeToday.id,
                  block,
                },
              })
              .then(v => v.pair);
          }

          // Calculate volume chnage between yesterday and today wherever applicable
          let volumeChangeUSD: number, volumeChangePercentage: number;
          if (pairVolumeToday?.volumeUSD && poolVolumeYesterday?.volumeUSD) {
            const volumeUSDToday = Number(pairVolumeToday.volumeUSD);
            const volumeUSDYesterday = Number(poolVolumeYesterday.volumeUSD);
            volumeChangeUSD = volumeUSDToday - volumeUSDYesterday;
            volumeChangePercentage = Math.abs(volumeChangeUSD / volumeUSDYesterday);
          } else if (pairVolumeToday?.untrackedVolumeUSD && poolVolumeYesterday?.untrackedVolumeUSD) {
            const volumeUSDToday = Number(pairVolumeToday.untrackedVolumeUSD);
            const volumeUSDYesterday = Number(poolVolumeYesterday.untrackedVolumeUSD);
            volumeChangeUSD = volumeUSDToday - volumeUSDYesterday;
            volumeChangePercentage = Math.abs(volumeChangeUSD / volumeUSDYesterday);
          } else {
            volumeChangeUSD = 0;
            volumeChangePercentage = 0;
          }

          return { poolAddress: pairVolumeToday.id, volumeChangeUSD, volumeChangePercentage };
        }),
      );

      return poolVolumes;
    };
  }
}
