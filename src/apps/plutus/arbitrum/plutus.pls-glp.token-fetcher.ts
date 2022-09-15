import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { PlutusContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumPlutusPlsGlpTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'plsGLP';

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
    return ['0x530f1cbb2ebd71bec58d351dcd3768148986a467'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x4277f8f2c384827b5273592ff7cebd9f2c1ac258'];
  }
}
