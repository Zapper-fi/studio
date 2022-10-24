import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CompoundSupplyTokenFetcher } from '../common/damm.supply.token-fetcher';
import { CompoundComptroller, CompoundContractFactory, CompoundCToken } from '../contracts';

@PositionTemplate()
export class EthereumCompoundSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  CompoundCToken,
  CompoundComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x4f96ab61520a6636331a48a11eafba8fb51f74e4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory) protected readonly contractFactory: CompoundContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.compoundCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.compoundComptroller({ address, network: this.network });
  }

  getMarkets(contract: CompoundComptroller) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: CompoundCToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: CompoundCToken) {
    return contract.exchangeRateCurrent();
  }

  async getSupplyRate(contract: CompoundCToken) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
