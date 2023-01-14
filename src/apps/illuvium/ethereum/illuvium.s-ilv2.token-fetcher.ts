import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { IlluviumContractFactory, IlluviumSIlv2 } from '../contracts';

@PositionTemplate()
export class EthereumIlluviumSIlv2TokenFetcher extends AppTokenTemplatePositionFetcher<IlluviumSIlv2> {
  groupLabel = 'sILV2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) protected readonly contractFactory: IlluviumContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): IlluviumSIlv2 {
    return this.contractFactory.illuviumSIlv2({ network: this.network, address });
  }

  async getAddresses() {
    console.log(this.network, this.appId, this.groupId);
    return ['0x7e77dcb127f99ece88230a64db8d595f31f1b068'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x767fe9edc9e0df98e07454847909b5e959d7ca0e', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
