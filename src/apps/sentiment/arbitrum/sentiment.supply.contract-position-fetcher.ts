import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SentimentAccountsResolver } from '../common/sentiment.accounts-resolver';
import { SentimentContractFactory, SentimentLToken } from '../contracts';

@PositionTemplate()
export class ArbitrumSentimentSupplyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SentimentLToken> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) private readonly contractFactory: SentimentContractFactory,
    @Inject(SentimentAccountsResolver) private readonly accountResolver: SentimentAccountsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SentimentLToken {
    return this.contractFactory.sentimentLToken({ address, network: this.network });
  }

  async getDefinitions() {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['supply-ati'],
    });

    return appTokens.map(x => ({ address: x.address }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<SentimentLToken>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.asset(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SentimentLToken>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contractPosition, multicall }: GetTokenBalancesParams<SentimentLToken>) {
    const accountAddresses = await this.accountResolver.getAccountsOfOwner(address);

    const supplyRaw = await Promise.all(
      accountAddresses.map(async address => {
        const supplyRaw = await multicall
          .wrap(this.contractFactory.erc20({ address: contractPosition.tokens[0].address, network: this.network }))
          .balanceOf(address);
        return Number(supplyRaw);
      }),
    );
    const depositedAmountRaw = _.sum(supplyRaw);

    return [depositedAmountRaw];
  }
}
