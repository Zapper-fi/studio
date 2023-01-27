import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { LyraAvalonContractFactory, LyraStkLyra } from '../contracts';

@PositionTemplate()
export class EthereumLyraAvalonStkLyraTokenFetcher extends AppTokenTemplatePositionFetcher<LyraStkLyra> {
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
    return ['0xcb9f85730f57732fc899fb158164b9ed60c77d49'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x01ba67aac7f75f647d94220cc98fb30fcc5105bf', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
