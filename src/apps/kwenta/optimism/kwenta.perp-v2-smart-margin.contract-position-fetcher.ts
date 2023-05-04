import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixContractFactory } from '../../synthetix/contracts';
import { OptimismSynthetixPerpV2ContractPositionFetcher } from '../../synthetix/optimism/synthetix.perp-v2.contract-position-fetcher';
import { KwentaContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismKwentaPerpV2SmartMarginContractPositionFetcher extends OptimismSynthetixPerpV2ContractPositionFetcher {
  groupLabel = 'PerpV2 smart-margin';
  useCustomMarketLogos = true;
  kwentaAccountResolverAddress = '0x8234f990b149ae59416dc260305e565e5dafeb54';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(KwentaContractFactory) protected readonly kwentaContractFactory: KwentaContractFactory,
  ) {
    super(appToolkit, synthetixContractFactory);
  }

  async getAccountAddress(address: string): Promise<string> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const accountResolver = this.kwentaContractFactory.kwentaAccountResolver({
      address: this.kwentaAccountResolverAddress,
      network: this.network,
    });
    const mcAccountResolver = multicall.wrap(accountResolver);
    const accountsOwned = await mcAccountResolver.getAccountsOwnedBy(address);
    if (accountsOwned.length === 0) {
      return ZERO_ADDRESS;
    }
    return accountsOwned[0];
  }
}
