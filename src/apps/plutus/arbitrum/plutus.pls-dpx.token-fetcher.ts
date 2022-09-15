import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { PlutusContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumPlutusPlsDpxTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'plsDPX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55'];
  }
}
