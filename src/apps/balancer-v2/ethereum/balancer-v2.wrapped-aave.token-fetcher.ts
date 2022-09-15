import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { BalancerV2ContractFactory, BalancerWrappedAaveToken } from '../contracts';

@PositionTemplate()
export class EthereumBalancerV2WrappedAaveTokenFetcher extends AppTokenTemplatePositionFetcher<BalancerWrappedAaveToken> {
  groupLabel = 'Wrapped Aave';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return [
      '0x02d60b84491589974263d922d9cc7a3152618ef6', // Wrapped aDAI
      '0xd093fa4fb80d09bb30817fdcd442d4d02ed3e5de', // Wrapped aUSDC
      '0xf8fd466f12e236f4c96f7cce6c79eadb819abf58', // Wrapped aUSDT
    ];
  }

  getContract(address: string) {
    return this.contractFactory.balancerWrappedAaveToken({ address, network: this.network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BalancerWrappedAaveToken>) {
    return contract.callStatic.ATOKEN();
  }
}
