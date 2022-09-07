import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type ArrakisPoolFetcherResponse = {
  pools: {
    id: string;
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
  }[];
};

export const POOL_ADDRESSES_QUERY = gql`
  {
    pools {
      id
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }
`;

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [Network.ETHEREUM_MAINNET]: '',
  [Network.POLYGON_MAINNET]: '-polygon',
  [Network.OPTIMISM_MAINNET]: '-optimism',
};

@Injectable()
export class ArrakisPoolDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:arrakis:${network}:pool-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getPoolDefinitionsData(network: Network) {
    const data = await this.appToolkit.helpers.theGraphHelper.request<ArrakisPoolFetcherResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/gelatodigital/g-uni${NETWORK_NAME[network]}`,
      query: POOL_ADDRESSES_QUERY,
    });

    return data.pools;
  }

  async getPoolDefinitions(network: Network) {
    const poolDefinitionsData = await this.getPoolDefinitionsData(network);

    const poolDefinitions = poolDefinitionsData.map(pool => {
      return {
        address: pool.id.toLowerCase(),
        underlyingTokenAddress0: pool.token0.id.toLowerCase(),
        underlyingTokenAddress1: pool.token1.id.toLowerCase(),
      };
    });

    return poolDefinitions;
  }
}
