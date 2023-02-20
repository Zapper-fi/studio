import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { GmxContractFactory } from '../contracts';

export abstract class GmxEsGmxTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  abstract esGmxAddress: string;
  abstract gmxAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GmxContractFactory) protected readonly contractFactory: GmxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return [this.esGmxAddress];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: this.gmxAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
