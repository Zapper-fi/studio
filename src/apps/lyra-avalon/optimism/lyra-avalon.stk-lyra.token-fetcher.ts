import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

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
    return ['0xde48b1b5853cc63b1d05e507414d3e02831722f8'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x50c5725949a6f0c72e6c4a641f24049a917db0cb'];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<LyraStkLyra>) {
    return appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<LyraStkLyra>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    // @TODO Probably a Lyra Avalon APY helper contract somewhere
    return 0;
  }
}
