import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { MuxViemContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumMuxMuxTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'MUX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getImages() {
    return [getAppAssetImage('mux', 'MUX')];
  }
}
