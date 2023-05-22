import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';

export interface SolidLizardApiPairData {
  pairs: {
    id: string;
    symbol: string;
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
    gauge: {
      id: string;
    };
    rewardTokens: {
      apr: string;
      token: {
        id: string;
        symbol: string;
      };
    }[];
    gaugebribes: {
      id: string;
      bribeTokens: {
        apr: string;
        token: {
          symbol: string;
        };
      }[];
    };
  }[];
}

const poolsQuery = gql`
  {
    pairs(first: 1000) {
      id
      name
      symbol
      isStable
      totalSupply
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      gauge {
        id
        totalSupply
        totalSupplyETH
        expectAPR
        expectAPRDerived
        voteWeight
        totalWeight
        rewardTokens {
          apr
          finishPeriod
          token {
            id
            symbol
          }
        }
      }
      fee
      gaugebribes {
        id
        bribeTokens {
          apr
          token {
            symbol
          }
        }
      }
    }
  }
`;

@Injectable()
export class SolidLizardDefinitionsResolver {
  @Cache({
    key: `studio:solid-lizard:pool-token-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getPoolDefinitionsData() {
    const response = await gqlFetch<SolidLizardApiPairData>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/solidlizardfinance/sliz',
      query: poolsQuery,
    });

    return response.pairs;
  }

  async getPoolTokenDefinitions() {
    const definitionsData = await this.getPoolDefinitionsData();

    return definitionsData.map(pool => {
      return {
        ...pool,
        address: pool.id.toLowerCase(),
      };
    });
  }

  async getFarmAddresses() {
    const definitionsData = await this.getPoolDefinitionsData();

    return definitionsData.map(pool => pool.gauge?.id?.toLowerCase()).filter(v => !!v);
  }

  async getBribeDefinitions() {
    const definitionsData = await this.getPoolDefinitionsData();

    const definitionsRaw = definitionsData
      .filter(v => !!v)
      .filter(v => !!v.gauge)
      .map(pool => {
        const wBribeAddress = pool.gaugebribes?.id;
        if (wBribeAddress == null) return null;

        return { address: wBribeAddress.toLowerCase(), name: pool.symbol };
      });

    return _.compact(definitionsRaw);
  }
}
