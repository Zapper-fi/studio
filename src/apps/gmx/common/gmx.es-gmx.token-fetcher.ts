import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { GmxViemContractFactory } from '../contracts';

export abstract class GmxEsGmxTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  abstract esGmxAddress: string;
  abstract gmxAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GmxViemContractFactory) protected readonly contractFactory: GmxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
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
