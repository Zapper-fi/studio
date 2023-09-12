import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { LyraAvalonContractFactory, LyraStkLyra } from '../contracts';

@PositionTemplate()
export class OptimismLyraAvalonStkLyraTokenFetcher extends AppTokenTemplatePositionFetcher<LyraStkLyra> {
  groupLabel = 'stkLYRA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) protected readonly contractFactory: LyraAvalonContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LyraStkLyra {
    return this.contractFactory.lyraStkLyra({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x0f5d45a7023612e9e244fe84fac5fcf3740d1492'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
