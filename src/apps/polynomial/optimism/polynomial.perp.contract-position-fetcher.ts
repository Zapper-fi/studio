import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixContractFactory } from '../../synthetix/contracts';
import { OptimismSynthetixPerpV2ContractPositionFetcher } from '../../synthetix/optimism/synthetix.perp-v2.contract-position-fetcher';
import { PolynomialAccountResolver } from '../common/polynomial.account-resolver';
import { PolynomialContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismPolynomialPerpContractPositionFetcher extends OptimismSynthetixPerpV2ContractPositionFetcher {
  groupLabel = 'Perp';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(PolynomialContractFactory) protected readonly polynomialContractFactory: PolynomialContractFactory,
    @Inject(PolynomialAccountResolver) protected readonly polynomialAccountResolver: PolynomialAccountResolver,
  ) {
    super(appToolkit, synthetixContractFactory);
  }

  async getAccountAddress(address: string): Promise<string> {
    return this.polynomialAccountResolver.getSmartWalletAddress(address);
  }
}
