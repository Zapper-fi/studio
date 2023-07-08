import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { PikaProtocolContractFactory, PikaProtocolEsPika } from '../contracts';

@PositionTemplate()
export class OptimismPikaProtocolEsPikaTokenFetcher extends AppTokenTemplatePositionFetcher<PikaProtocolEsPika> {
  groupLabel = 'EsPika';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolContractFactory) protected readonly contractFactory: PikaProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PikaProtocolEsPika {
    return this.contractFactory.pikaProtocolEsPika({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x1508fbb7928aedc86bee68c91bc4afcf493b0e78'];
  }

  async getUnderlyingTokenDefinitions(_params: GetUnderlyingTokensParams<PikaProtocolEsPika>) {
    return [{ address: '0x9a601c5bb360811d96a23689066af316a30c3027', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
