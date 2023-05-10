import { Inject } from '@nestjs/common';
import { Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SentimentAccount, SentimentContractFactory } from '../contracts';

import { SentimentDefinitionsResolver } from './sentiment.account.definitions-resolver';

export type SentimentAccountDefinition = {
  address: string;
  owner: string;
};

@PositionTemplate()
export class ArbitrumSentimentAccountContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel: string;
  subgraphUrl: string;
  investableAssets: string[];
  borrowableAssets: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) protected readonly sentimentContractFactory: SentimentContractFactory,
    @Inject(SentimentDefinitionsResolver) protected readonly sentimentDefinitionsResolver: SentimentDefinitionsResolver,
  ) {
    super(appToolkit);
    this.groupLabel = 'Accounts';
    this.investableAssets = [];
    this.borrowableAssets = [];
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<SentimentAccountDefinition[]> {
    const [sentimentAccounts, investableAssets, borrowableAssets] = await Promise.all([
      this.sentimentDefinitionsResolver.getAllAccountsDefinitions(),
      this.sentimentDefinitionsResolver.getAllInvestableAssetsFromSubgraph(),
      this.sentimentDefinitionsResolver.getAllLendingMarketsFromSubgraph(),
    ]);
    this.investableAssets = investableAssets;
    this.borrowableAssets = borrowableAssets;

    return sentimentAccounts;
  }

  getContract(_address: string): SentimentAccount {
    return this.sentimentContractFactory.sentimentAccount({
      address: _address,
      network: this.network,
    });
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<SentimentAccount, SentimentAccountDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      ...this.investableAssets.map(address => ({
        metaType: MetaType.SUPPLIED,
        address: address.toLowerCase(),
        network: this.network,
      })),
      ...this.borrowableAssets.map(address => ({
        metaType: MetaType.BORROWED,
        address: address.toLowerCase(),
        network: this.network,
      })),
    ];
  }

  async getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, SentimentAccountDefinition>,
  ): Promise<string> {
    return 'Sentiment account';
  }

  async getTokenBalancesPerPosition(_params: GetTokenBalancesParams<SentimentAccount>) {
    console.log('getTokenBalancesPerPosition');
    return ['0'];
  }

  async getBalances(_address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    console.log('this.appId : ', this.appId);
    console.log('this.groupId : ', this.groupId);
    const sentimentAccounts = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });
    console.log('accounts : ', sentimentAccounts);
    const userAccounts = sentimentAccounts.filter(sentimentAccount => sentimentAccount.dataProps.owner === _address);

    return ['0'];
  }
}
