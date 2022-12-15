import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { MAPLE_DEFINITION } from '../maple.definition';

type MaplePoolResponse = {
  poolV2S?: {
    id: string;
    name: string;
    apyData: {
      apy: string;
    };
  }[];
};

const ALL_POOLS_QUERY = gql`
  {
    poolV2S {
      id
      name
      apyData {
        apy
      }
    }
  }
`;

@Injectable()
export class MaplePoolDefinitionResolver {
  @CacheOnInterval({
    key: `studio:${MAPLE_DEFINITION.id}:${MAPLE_DEFINITION.groups.pool.id}:${Network.ETHEREUM_MAINNET}:pool-data`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getPoolDefinitions() {
    const client = new GraphQLClient('https://api.maple.finance/v2/graphql', {
      headers: { 'Content-Type': 'application/json' },
    });
    const pairsData = await client.request<MaplePoolResponse>(ALL_POOLS_QUERY);

    return (pairsData.poolV2S ?? []).map(pool => ({
      address: pool.id.toLowerCase(),
      poolName: pool.name,
      apy: Number(pool.apyData.apy),
    }));
  }
}
