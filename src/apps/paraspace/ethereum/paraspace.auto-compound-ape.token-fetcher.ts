import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { DefaultAppTokenDefinition, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { ParaspaceAutoCompoundApe, ParaspaceContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumParaspaceAutoCompoundApeTokenFetcher extends AppTokenTemplatePositionFetcher<ParaspaceAutoCompoundApe> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ParaspaceContractFactory) protected readonly paraspaceContractFactory: ParaspaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ParaspaceAutoCompoundApe {
    return this.paraspaceContractFactory.paraspaceAutoCompoundApe({ address: address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0xc5c9fb6223a989208df27dcee33fc59ff5c26fff', // cAPE
    ];
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<ParaspaceAutoCompoundApe, DefaultAppTokenDefinition>) {
    return [{ address: await contract.apeCoin(), network: this.network }];
  }

  async getPricePerShare(): Promise<number[]> {
    return [1];
  }
}
