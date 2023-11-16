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
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SentimentAccountsResolver } from '../common/sentiment.accounts-resolver';
import { SentimentViemContractFactory } from '../contracts';
import { SentimentLToken } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumSentimentBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SentimentLToken> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentViemContractFactory) private readonly contractFactory: SentimentViemContractFactory,
    @Inject(SentimentAccountsResolver) private readonly accountResolver: SentimentAccountsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.sentimentLToken({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const registryContract = this.contractFactory.sentimentRegistry({
      address: '0x17b07cfbab33c0024040e7c299f8048f4a49679b',
      network: this.network,
    });
    const marketAddressRaw = await multicall.wrap(registryContract).read.getAllLTokens();

    return marketAddressRaw.map(x => ({ address: x }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<SentimentLToken>) {
    return [
      {
        metaType: MetaType.BORROWED,
        address: await contract.read.asset(),
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
      accountAddresses.map(address => multicall.wrap(contract).read.getBorrowBalance([address])),
    );
    const borrowedAmountRaw = _.sum(borrowRaw);

    return [borrowedAmountRaw];
  }
}
