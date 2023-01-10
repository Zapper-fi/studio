import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { BalancerV2ContractFactory } from '../contracts';
import { BalancerStaticAToken } from '../contracts/ethers/BalancerStaticAToken';

export abstract class BalancerV2StaticYieldTokenFetcher extends AppTokenTemplatePositionFetcher<BalancerStaticAToken> {
  abstract staticYieldTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BalancerStaticAToken {
    return this.contractFactory.balancerStaticAToken({ address, network: this.network });
  }

  async getAddresses() {
    return this.staticYieldTokenAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<BalancerStaticAToken>) {
    return [{ address: await contract.callStatic.ATOKEN(), network: this.network }];
  }

  async getPricePerShare() {
    return 1;
  }
}
