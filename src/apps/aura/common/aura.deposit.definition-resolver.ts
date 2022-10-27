import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

import AURA_DEFINITION from '../aura.definition';

type Pools = {
  pools: {
    depositToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    lpToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    totalSupply: string;
  }[];
};

const QUERY = gql`
  {
    pools(where: { isFactoryPool: true }) {
      depositToken {
        id
        symbol
        name
        decimals
      }
      lpToken {
        id
        symbol
        decimals
        name
      }
      totalSupply
      rewardPool
    }
  }
`;

type AuraDepositDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@Injectable()
export class AuraDepositDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: `studio:${AURA_DEFINITION.id}:deposit:data`,
    ttl: 15 * 60,
  })
  private async getDepositDefinitionData() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/aurafinance/aura`;
    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<Pools>({
      endpoint,
      query: QUERY,
    });

    return pools;
  }

  async getDepositDefinitions(): Promise<AuraDepositDefinition[]> {
    const poolDefinitionsData = await this.getDepositDefinitionData();

    const poolDefinitions = await Promise.all(
      poolDefinitionsData.map(pool => {
        return {
          address: pool.depositToken.id.toLowerCase(),
          underlyingTokenAddress: pool.lpToken.id.toLowerCase(),
        };
      }),
    );
    return poolDefinitions;
  }
}
