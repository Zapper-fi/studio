/*import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { AbcCvx, CleverContractFactory } from '../contracts';

import { abcCVX } from './addresses';

@PositionTemplate()
export class EthereumCleverAbcTokenFetcher extends AppTokenTemplatePositionFetcher<AbcCvx> {
  groupLabel = 'abcCVX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbcCvx {
    return this.contractFactory.abcCvx({ address, network: this.network });
  }

  getAddresses() {
    return [abcCVX];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AbcCvx>) {
    return [
      { address: await contract.curveLpToken(), network: this.network },
      { address: await contract.debtToken(), network: this.network },
    ];
  }

  async getPricePerShare() {
    return [(await this.getContract(abcCVX).ratio()).div(10 ** 6).toNumber() / 2];
  }
}*/
