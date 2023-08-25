import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';

export type RubiconPoolFetcherResponse = {
  pools: {
    address: string;
    underlyingToken: string;
  }[];
};

export const POOL_QUERY = gql`
  {
    pools {
      address
      underlyingToken
    }
  }
`;

@Injectable()
export class RubiconBathTokenDefinitionResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: `studio:rubicon:optimism:pool-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getPoolDefinitionsData() {
    const data = await gqlFetch<RubiconPoolFetcherResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/denverbaumgartner/bathtokenoptimism?source=zapper`,
      query: POOL_QUERY,
    });

    return data;
  }

  async getPoolDefinitions() {
    const definitionsData = await this.getPoolDefinitionsData();

    const poolDefinitions = definitionsData.pools.map(pool => {
      return {
        address: pool.address.toLowerCase(),
        underlyingTokenAddress: pool.underlyingToken.toLowerCase(),
      };
    });
    return poolDefinitions;
  }
}
