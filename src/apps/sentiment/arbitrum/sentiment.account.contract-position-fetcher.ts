import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch, gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { Cache } from '~cache/cache.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SentimentAccount, SentimentContractFactory, SentimentRegistry } from '../contracts';

import { SENTIMENT_REGISTRY_ADDRESS } from './sentiment.constants';

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

type SentimentAccountDefinition = {
  address: string;
  owner: string;
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

@PositionTemplate()
export class ArbitrumSentimentAccountContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel: string;
  subgraphUrl: string;
  registry: SentimentRegistry;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) protected readonly sentimentContractFactory: SentimentContractFactory,
  ) {
    super(appToolkit);
    this.groupLabel = 'Accounts';
    this.subgraphUrl = 'https://api.thegraph.com/subgraphs/name/r0ohafza/sentiment';
    this.registry = this.sentimentContractFactory.sentimentRegistry({
      address: SENTIMENT_REGISTRY_ADDRESS,
      network: this.network,
    });
  }

  @Cache({
    key: `studio:sentiment:borrowable-assets`,
    ttl: 5 * 60, // 60 minutes
  })
  async getLendingMarketsFromSubgraph(): Promise<string[]> {
    const response = await gqlFetch<GetLendingMarketsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_LENDING_MARKETS_QUERY,
    });

    return response.markets.map(market => market.asset.id);
  }

  @Cache({
    key: `studio:sentiment:assets`,
    ttl: 5 * 60, // 60 minutes
  })
  async getAssetsFromSubgraph(): Promise<string[]> {
    const response = await gqlFetch<GetAssetsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_ASSETS_QUERY,
    });

    return response.assets.map(asset => asset.id);
  }

  @Cache({
    key: `studio:sentiment:accounts`,
    ttl: 5 * 60, // 60 minutes
  })
  async getAccountsFromSubgraph(): Promise<SentimentAccountDefinition[]> {
    const response = await gqlFetchAll<GetAccountsResponse>({
      query: GET_ALL_ACCOUNTS_QUERY,
      endpoint: this.subgraphUrl,
      variables: undefined,
      dataToSearch: 'accounts',
    });
    return response.accounts.map(account => ({
      address: account.id,
      owner: account.owner.id,
    }));
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<SentimentAccountDefinition[]> {
    const sentimentAccounts = await this.getAccountsFromSubgraph();

    return sentimentAccounts;
  }

  getContract(_address: string): Contract {
    return this.sentimentContractFactory.sentimentAccount({
      address: _address,
      network: this.network,
    });
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<Contract, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const [investableAssets, borrowableAssets] = await Promise.all([
      this.getAssetsFromSubgraph(),
      this.getLendingMarketsFromSubgraph(),
    ]);

    return [
      ...investableAssets.map(address => ({
        metaType: MetaType.SUPPLIED,
        address: address.toLowerCase(),
        network: this.network,
      })),
      ...borrowableAssets.map(address => ({
        metaType: MetaType.BORROWED,
        address: address.toLowerCase(),
        network: this.network,
      })),
    ];
  }

  async getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Sentiment account';
  }

  async getTokenBalancesPerPosition(_params: GetTokenBalancesParams<SentimentAccount>) {
    console.log('getTokenBalancesPerPosition');
    return ['0'];
  }
}
