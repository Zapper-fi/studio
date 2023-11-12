import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SentimentAccountsResolver } from '../common/sentiment.accounts-resolver';
import { SentimentContractFactory, SentimentLToken } from '../contracts';

@PositionTemplate()
export class ArbitrumSentimentBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SentimentLToken> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) private readonly contractFactory: SentimentContractFactory,
    @Inject(SentimentAccountsResolver) private readonly accountResolver: SentimentAccountsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SentimentLToken {
    return this.contractFactory.sentimentLToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['supply'],
    });

    return appTokens.map(x => ({ address: x.address }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<SentimentLToken>) {
    return [
      {
        metaType: MetaType.BORROWED,
        address: await contract.asset(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SentimentLToken>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<SentimentLToken>): Promise<BigNumberish[]> {
    const accountAddresses = await this.accountResolver.getAccountsOfOwner(address);

    const borrowRaw = await Promise.all(
      accountAddresses.map(address => multicall.wrap(contract).getBorrowBalance(address)),
    );
    const borrowedAmountRaw = _.sum(borrowRaw);

    return [borrowedAmountRaw];
  }
}
