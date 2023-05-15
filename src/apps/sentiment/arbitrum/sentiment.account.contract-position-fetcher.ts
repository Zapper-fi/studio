import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { SentimentAccount, SentimentContractFactory } from '../contracts';

import { SentimentDefinitionsResolver } from './sentiment.account.definitions-resolver';
import { SENTIMENT_REGISTRY_IMPL_ADDRESS } from './sentiment.constants';

export type SentimentAccountDefinition = {
  address: string;
  owner: string;
};

export type SentimentAccountDataProps = DefaultDataProps & {
  address: string;
  owner: string;
};

@PositionTemplate()
export class ArbitrumSentimentAccountContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SentimentAccount,
  SentimentAccountDataProps,
  SentimentAccountDefinition
> {
  groupLabel: string;
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

  async getDefinitions(): Promise<SentimentAccountDefinition[]> {
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

  async getLabel(): Promise<string> {
    return 'Sentiment accounts';
  }

  async getTokenBalancesPerPosition({ address, contractPosition }: GetTokenBalancesParams<SentimentAccount>) {
    const allTokens = await this.appToolkit.getBaseTokenPrices(this.network);

    const accountBalances = await Promise.all(
      contractPosition.tokens.map(async (token, _index) => {
        const tokenBase = allTokens.find(tokenBase => tokenBase.address === token.address);
        if (!tokenBase) {
          return '0';
        }
        if (token.metaType === MetaType.SUPPLIED) {
          const balanceRaw = await this.sentimentContractFactory
            .erc20({ address: token.address, network: this.network })
            .balanceOf(address);
          return balanceRaw;
        }
        if (token.metaType === MetaType.BORROWED) {
          const lToken = await this.sentimentContractFactory
            .sentimentRegistry({
              address: SENTIMENT_REGISTRY_IMPL_ADDRESS,
              network: this.network,
            })
            .LTokenFor(token.address);
          const borrowBalanceRaw = await this.sentimentContractFactory
            .sentimentLToken({ address: lToken, network: this.network })
            .getBorrowBalance(address);

          return borrowBalanceRaw;
        }
        return '0';
      }),
    );

    return accountBalances;
  }

  // async getBalances(_address: string): Promise<ContractPositionBalance<SentimentAccountDataProps>[]> {
  //   const sentimentAccounts = await this.appToolkit.getAppContractPositions<SentimentAccountDataProps>({
  //     appId: this.appId,
  //     network: this.network,
  //     groupIds: [this.groupId],
  //   });
  //   console.log('sentimentAccounts : ', sentimentAccounts);
  //   const userAccounts = await this.sentimentContractFactory
  //     .sentimentRegistry({
  //       address: SENTIMENT_REGISTRY_IMPL_ADDRESS,
  //       network: this.network,
  //     })
  //     .accountsOwnedBy(_address);
  //   console.log('userAccounts from registry : ', userAccounts);
  //   const allTokens = await this.appToolkit.getBaseTokenPrices(this.network);

  //   const accountsBalances: ContractPositionBalance<SentimentAccountDataProps>[] = await Promise.all(
  //     sentimentAccounts.map(async accountPosition => {
  //       const accountTokens: WithMetaType<TokenBalance>[] = [];

  //       await Promise.all(
  //         accountPosition.tokens.map(async (token, _index) => {
  //           const tokenBase = allTokens.find(tokenBase => tokenBase.address === token.address);
  //           if (!tokenBase) {
  //             return;
  //           }
  //           if (token.metaType === MetaType.SUPPLIED) {
  //             const balanceRaw = await this.sentimentContractFactory
  //               .erc20({ address: token.address, network: this.network })
  //               .balanceOf(_address);
  //             const balance = balanceRaw.toNumber() / 10 ** tokenBase.decimals;
  //             accountTokens[_index] = {
  //               ...token,
  //               ...tokenBase,
  //               balanceRaw: balanceRaw.toString(),
  //               balance,
  //               balanceUSD: balance * tokenBase.price,
  //             };
  //           }
  //           if (token.metaType === MetaType.BORROWED) {
  //             const lToken = await this.sentimentContractFactory
  //               .sentimentRegistry({
  //                 address: SENTIMENT_REGISTRY_ADDRESS,
  //                 network: this.network,
  //               })
  //               .LTokenFor(token.address);

  //             const borrowBalanceRaw = await this.sentimentContractFactory
  //               .sentimentLToken({ address: lToken, network: this.network })
  //               .getBorrowBalance(_address);
  //             const borrowBalance = borrowBalanceRaw.toNumber() / 10 ** tokenBase.decimals;

  //             accountTokens[_index] = {
  //               ...token,
  //               ...tokenBase,
  //               balanceRaw: borrowBalanceRaw.toString(),
  //               balance: borrowBalance,
  //               balanceUSD: borrowBalance * tokenBase.price,
  //             };
  //           }
  //         }),
  //       );
  //       const totalDeposited = accountTokens
  //         .filter(({ metaType }) => metaType === MetaType.SUPPLIED)
  //         .reduce((acc, { balanceUSD }) => acc + balanceUSD, 0);
  //       const totalBorrowed = accountTokens
  //         .filter(({ metaType }) => metaType === MetaType.BORROWED)
  //         .reduce((acc, { balanceUSD }) => acc + balanceUSD, 0);
  //       console.log('total borrowed : ', totalBorrowed);
  //       return {
  //         ...accountPosition,
  //         tokens: accountTokens,
  //         balanceUSD: totalDeposited + totalBorrowed,
  //         type: ContractType.POSITION,
  //       };
  //     }),
  //   );

  //   return accountsBalances;
  // }
}
