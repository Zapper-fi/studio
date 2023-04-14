import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { LyraAvalonContractFactory, LyraStkLyra } from '../contracts';

@PositionTemplate()
export class ArbitrumLyraAvalonStkLyraTokenFetcher extends AppTokenTemplatePositionFetcher<LyraStkLyra> {
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
    return ['0x5b237ab26ced47fb8ed104671819c801aa5ba45e'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x079504b86d38119f859c4194765029f692b7b7aa', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
