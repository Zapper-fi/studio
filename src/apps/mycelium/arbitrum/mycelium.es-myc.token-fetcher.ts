import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { MyceliumContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumMyceliumEsMycTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'esMYC';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) protected readonly contractFactory: MyceliumContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ network: this.network, address });
  }

  async getAddresses() {
    return ['0x7cec785fba5ee648b48fbffc378d74c8671bb3cb'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xc74fe4c715510ec2f8c61d70d397b32043f55abe', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
