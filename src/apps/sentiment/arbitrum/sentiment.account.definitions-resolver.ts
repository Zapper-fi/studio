import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { gqlFetch, gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';

import { SentimentAccountDefinition } from './sentiment.account.contract-position-fetcher';

type GetLendingMarketsResponse = {
  markets: {
    asset: {
      id: string;
    };
  }[];
};

type GetAssetsResponse = {
  assets: {
    id: string;
  }[];
};

type GetAccountsResponse = {
  accounts: {
    id: string;
    blockNumber: string;
    owner: {
      id: string;
    };
  }[];
};

const GET_LENDING_MARKETS_QUERY = gql`
  query getLendingMarkets {
    markets {
      asset {
        id
      }
    }
  }
`;

const GET_ASSETS_QUERY = gql`
  query getAssets {
    assets {
      id
    }
  }
`;

const GET_ALL_ACCOUNTS_QUERY = gql`
  query getFirstAccounts($first: Int!, $lastId: String) {
    accounts(first: $first, orderBy: id, orderDirection: asc, where: { id_gt: $lastId }) {
      id
      blockNumber
      owner {
        id
      }
    }
  }
`;

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/r0ohafza/sentiment';

@Injectable()
export class SentimentDefinitionsResolver {
  @Cache({
    key: `studio:sentiment:accounts`,
    ttl: 5 * 60,
  })
  async getAllAccountsDefinitions(): Promise<SentimentAccountDefinition[]> {
    const response = await gqlFetchAll<GetAccountsResponse>({
      query: GET_ALL_ACCOUNTS_QUERY,
      endpoint: SUBGRAPH_URL,
      variables: undefined,
      dataToSearch: 'accounts',
    });
    return response.accounts.map(account => ({
      address: account.id,
      owner: account.owner.id,
    }));
  }

  @Cache({
    key: `studio:sentiment:borrowable-assets`,
    ttl: 5 * 60, // 60 minutes
  })
  async getAllLendingMarketsFromSubgraph(): Promise<string[]> {
    const response = await gqlFetch<GetLendingMarketsResponse>({
      endpoint: SUBGRAPH_URL,
      query: GET_LENDING_MARKETS_QUERY,
    });

    return response.markets.map(market => market.asset.id);
  }

  @Cache({
    key: `studio:sentiment:assets`,
    ttl: 5 * 60, // 60 minutes
  })
  async getAllInvestableAssetsFromSubgraph(): Promise<string[]> {
    const response = await gqlFetch<GetAssetsResponse>({
      endpoint: SUBGRAPH_URL,
      query: GET_ASSETS_QUERY,
    });

    return response.assets.map(asset => asset.id);
  }
}
