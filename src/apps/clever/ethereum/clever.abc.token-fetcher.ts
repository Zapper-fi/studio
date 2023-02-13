import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { AbcCvx, CleverContractFactory } from '../contracts';

import { CVX, CLEVCVX, abcCVX } from './addresses';

@PositionTemplate()
export class EthereumCleverAbcTokenFetcher extends AppTokenTemplatePositionFetcher<AbcCvx> {
  groupLabel = 'abcCVX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) : AbcCvx{
    return this.contractFactory.abcCvx({ address, network: this.network });
  }

  getAddresses() {
    return [abcCVX];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xF9078Fb962A7D13F55d40d49C8AA6472aBD1A5a6', network: this.network }, { address: CLEVCVX, network: this.network }];
    
  }

  async getPricePerShare() {
    return [(await this.getContract(abcCVX).ratio()).div(10**6).toNumber() / 2 ];
  }
}
