import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
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

import { SENTIMENT_REGISTRY_ADDRESS, SENTIMENT_REGISTRY_IMPL_ADDRESS } from './sentiment.constants';

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

const GET_ACCOUNTS_QUERY = gql`
  query getAccounts {
    accounts {
      id
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
  async getAccountsFromSubgraph(): Promise<{ address: string; owner: string }[]> {
    const response = await gqlFetch<GetAccountsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_ACCOUNTS_QUERY,
    });

    return response.accounts.map(account => ({
      address: account.id,
      owner: account.owner.id,
    }));
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<SentimentAccountDefinition[]> {
    const sentimentAccountsRaw = await multicall
      .wrap(
        this.sentimentContractFactory.sentimentRegistry({
          address: SENTIMENT_REGISTRY_IMPL_ADDRESS,
          network: this.network,
        }),
      )
      .getAllAccounts();
    console.log('accounts : ', sentimentAccountsRaw);
    // sentimentAccountsRaw.push('0x03e2db735e111b2fc6c050f720c5a53a172b66d6');
    // const sentimentAccounts = await Promise.all(
    //   sentimentAccountsRaw.map(async address => {
    //     const owner = await this.sentimentContractFactory
    //       .sentimentRegistry({
    //         address: SENTIMENT_REGISTRY_ADDRESS,
    //         network: this.network,
    //       })
    //       .ownerFor(address);
    //     console.log('owner :', owner);
    //     return {
    //       address,
    //       owner,
    //     };
    //   }),
    // );
    return [
      {
        address: '0x03e2db735e111b2fc6c050f720c5a53a172b66d6',
        owner: '0xdbf01a7705451170e1191d354ee9eb84245f4861',
      },
    ];
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
    const [allAssets, lendingMarkets] = await Promise.all([
      this.getAssetsFromSubgraph(),
      this.getLendingMarketsFromSubgraph(),
    ]);

    const investableAssets = [...allAssets];
    const borrowableAssets = [...lendingMarkets];

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

  // async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
  //   // const accounts = await this.getUserAccountsFromSubgraph(address);
  //   const accounts = await this.sentimentContractFactory
  //     .sentimentRegistry({
  //       address: SENTIMENT_REGISTRY_ADDRESS,
  //       network: this.network,
  //     })
  //     .accountsOwnedBy(address.toString());
  //   console.log('accounts : ', accounts);

  //   const [allAssets, lendingMarkets] = await Promise.all([
  //     this.getAssetsFromSubgraph(),
  //     this.getLendingMarketsFromSubgraph(),
  //   ]);
  //   console.log('contracts : ', contractPositions);

  //   const allBalances: number[] = [];
  //   await Promise.all(
  //     accounts.map(async account => {
  //       // const positionsTest = this.getTokenBalancesPerPosition(account)
  //       const accountContract = this.getContract(account);
  //       const accountAssets = await accountContract.getAssets();
  //       console.log('assets', accountAssets);
  //       const assetsBalances: { asset: string; balance: number }[] = await Promise.all(
  //         accountAssets.map(async address => {
  //           const assetContract = this.sentimentContractFactory.erc20({ address, network: this.network });
  //           const balanceRaw = await assetContract.balanceOf(account);
  //           console.log('asset : ', address);
  //           const balance = Number(balanceRaw);
  //           console.log('balance : ', balance);
  //           if (balance === 0) return;
  //           return { address, balance };
  //         }),
  //       );
  //       const accountAssetsBalances = await Promise.all(
  //         assetsBalances.map(async assetBalance => {
  //           const assetInfos = await this.appToolkit.getBaseTokenPrice({
  //             address: assetBalance.asset,
  //             network: this.network,
  //           });
  //           return merge({}, assetBalance, {
  //             balanceUSD: uniV3Token.balanceUSD,
  //             tokens: [{ ...assetInfos }],
  //             displayProps: {
  //               label: `Compounding ${uniV3Token.displayProps.label}`,
  //               images: uniV3Token.displayProps.images,
  //               statsItems: [],
  //             },
  //           });
  //         }),
  //       );
  //     }),
  //   );

  //   return [allBalances];
  // }
}
