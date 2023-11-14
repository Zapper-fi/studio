import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { BalancerV2ViemContractFactory } from '../contracts';
import { BalancerStaticAToken } from '../contracts/viem/BalancerStaticAToken';

export abstract class BalancerV2StaticYieldTokenFetcher extends AppTokenTemplatePositionFetcher<BalancerStaticAToken> {
  abstract staticYieldTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ViemContractFactory) protected readonly contractFactory: BalancerV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.balancerStaticAToken({ address, network: this.network });
  }

  async getAddresses() {
    return this.staticYieldTokenAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<BalancerStaticAToken>) {
    return [{ address: await contract.simulate.ATOKEN().then(v => v.result), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
