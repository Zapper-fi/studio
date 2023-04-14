import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import moment from 'moment';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type SiloFinanceMarketsResponse = {
  markets: {
    id: string;
    name: string;
    marketAssets: {
      sToken: {
        id: string;
      };
      spToken: {
        id: string;
      };
      dToken: {
        id: string;
      };
    }[];
  }[];
};

const MARKETS_QUERY = gql`
  {
    markets(orderBy: totalValueLockedUSD, orderDirection: desc, where: { inputToken_: { activeOracle_not: "null" } }) {
      id
      name
      marketAssets {
        sToken {
          id
        }
        spToken {
          id
        }
        dToken {
          id
        }
      }
    }
  }
`;

const SUBGRAPH_URL = {
  [Network.ETHEREUM_MAINNET]:
    'https://gateway.thegraph.com/api/fbf06f34dad21c4df6a9e1f647ba1d16/deployments/id/QmRMtCkaYsizfmoavcE1ULwc2DkG1GZjXDHTwHjXAAH9sp',
  [Network.ARBITRUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/siros-ena/silo-finance-arbitrum-alt',
};

@Injectable()
export class SiloFinanceDefinitionResolver {
  @Cache({
    key: network => `studio:silo-finance:${network}:silo-data`,
    ttl: moment.duration('15', 'minutes').asSeconds(),
  })
  private async getSiloDefinitionData(network: Network) {
    return gqlFetch<SiloFinanceMarketsResponse>({ endpoint: SUBGRAPH_URL[network], query: MARKETS_QUERY });
  }

  async getSiloDefinitions(network: Network) {
    const siloDefinitionData = await this.getSiloDefinitionData(network);
    if (!siloDefinitionData) return null;

    const siloDefinitions = siloDefinitionData.markets.map(market => ({
      name: market.name,
      siloAddress: market.id.toLowerCase(),
      marketAssets: market.marketAssets.map(marketAsset => ({
        sToken: marketAsset.sToken.id.toLowerCase(),
        spToken: marketAsset.spToken.id.toLowerCase(),
        dToken: marketAsset.dToken.id.toLowerCase(),
      })),
    }));

    return siloDefinitions;
  }
}
