import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type SiloFinanceMarketsResponse = {
  markets: {
    id: string;
    name: string;
  }[];
};

type SiloFinanceMarketAssetsResponse = {
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
};

const MARKETS_QUERY = gql`
  {
    markets(orderBy: totalValueLockedUSD, orderDirection: desc, where: { inputToken_: { activeOracle_not: "null" } }) {
      id
      name
  }
`;

const MARKETS_ASSETS_QUERY = gql`
  {
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
`;

const SUBGRAPH_URL: Partial<Record<Network, string>> = {
  [Network.ETHEREUM_MAINNET]:
    'https://gateway.thegraph.com/api/fbf06f34dad21c4df6a9e1f647ba1d16/deployments/id/QmRMtCkaYsizfmoavcE1ULwc2DkG1GZjXDHTwHjXAAH9sp',
  [Network.ARBITRUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/siros-ena/silo-finance-arbitrum-alt',
};

@Injectable()
export class SiloFinanceDefinitionResolver {
  @Cache({
    key: network => `studio:silo-finance:${network}:silo-data`,
    ttl: 15 * 60, // 15 minutes
  })
  private async getSiloDefinitionData(network: Network) {
    const url = SUBGRAPH_URL[network];
    if (!url) return null;

    const client = new GraphQLClient(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const marketsData = await client.request<SiloFinanceMarketsResponse>(MARKETS_QUERY);

    return marketsData;
  }

  async getSiloDefinition(network: Network) {
    const siloData = await this.getSiloDefinitionData(network);
    if (!siloData) return null;

    return siloData;
  }

  @Cache({
    key: network => `studio:silo-finance:${network}:markets-assets-data`,
    ttl: 15 * 60, // 15 minutes
  })
  private async getSiloMarketAssetsDefinitionData(network: Network) {
    const url = SUBGRAPH_URL[network];
    if (!url) return null;

    const client = new GraphQLClient(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const marketsData = await client.request<SiloFinanceMarketAssetsResponse>(MARKETS_ASSETS_QUERY);

    return marketsData;
  }

  async getSiloMarketAssetsDefinition(network: Network) {
    const marketAssetsData = await this.getSiloMarketAssetsDefinitionData(network);
    if (!marketAssetsData) return null;

    const marketAssetAddresses = marketAssetsData.marketAssets
      .map(market => {
        return [market.sToken.id.toLowerCase(), market.spToken.id.toLowerCase(), market.dToken.id.toLowerCase()];
      })
      .flat();

    return marketAssetAddresses;
  }
}
