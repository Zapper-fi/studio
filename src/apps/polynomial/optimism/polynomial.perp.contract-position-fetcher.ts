import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixContractFactory } from '../../synthetix/contracts';
import { OptimismSynthetixPerpV2ContractPositionFetcher } from '../../synthetix/optimism/synthetix.perp-v2.contract-position-fetcher';
import { PolynomialContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismPolynomialPerpContractPositionFetcher extends OptimismSynthetixPerpV2ContractPositionFetcher {
  groupLabel = 'Perp';
  polynomialAccountResolverAddress = '0x4a0b3986cb7e23df85a64100bf222cf69f9787aa';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
    @Inject(PolynomialContractFactory) protected readonly polynomialContractFactory: PolynomialContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  async getAccountAddress(address: string): Promise<string> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const accountResolver = this.polynomialContractFactory.polynomialAccountResolver({
      address: this.polynomialAccountResolverAddress,
      network: this.network,
    });
    const mcAccountResolver = multicall.wrap(accountResolver);
    const authorityAccounts = await mcAccountResolver.getAuthorityAccounts(address);
    if (authorityAccounts.length === 0) {
      return ZERO_ADDRESS;
    }
    return authorityAccounts[0].toLowerCase();
  }
}
