import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { UnderlyingTokenDefinition } from '~position/template/app-token.template.types';

import { VelaContractFactory } from '../contracts';

export abstract class VelaEsVelaTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'esVELA';

  abstract esVelaAddress: string;
  abstract velaAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelaContractFactory) private readonly velaContractFactory: VelaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.velaContractFactory.erc20({
      address,
      network: this.network,
    });
  }

  async getAddresses(): Promise<string[]> {
    return [this.esVelaAddress];
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.velaAddress, network: this.network }];
  }

  async getPricePerShare(): Promise<number[]> {
    return [1];
  }
}
