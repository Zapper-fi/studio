import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';

import { MAPLE_DEFINITION } from '../maple.definition';

type MapleAllPoolsResponse = {
  allPools?: {
    list?: {
      poolName: string;
      contractAddress: string;
      symbol: string;
      lpApy: string;
      farmingApy: string;
      stakeRewards: {
        id: string;
      };
      liquidityAsset: {
        address: string;
      };
    }[];
  };
};

const ALL_POOLS_QUERY = gql`
  {
    allPools {
      list {
        poolName
        contractAddress
        symbol
        lpApy
        farmingApy
        stakeRewards {
          id
        }
        liquidityAsset {
          address
        }
      }
    }
  }
`;

@Injectable()
export class MapleCacheManager {
  @CacheOnInterval({
    key: `studio:${MAPLE_DEFINITION.id}:${MAPLE_DEFINITION.groups.pool.id}:pool-data`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedPoolData() {
    const client = new GraphQLClient('https://api.maple.finance/v1/graphql', {
      headers: { 'Content-Type': 'application/json' },
    });
    const pairsData = await client.request<MapleAllPoolsResponse>(ALL_POOLS_QUERY);

    return (pairsData.allPools?.list ?? []).map(v => ({
      poolName: v.poolName,
      apy: Number(v.lpApy) + Number(v.farmingApy),
      poolAddress: v.contractAddress.toLowerCase(),
      farmAddress: v.stakeRewards.id.toLowerCase(),
    }));
  }
}
