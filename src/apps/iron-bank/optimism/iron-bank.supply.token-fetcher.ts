import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher } from '~apps/compound/common/compound.supply.token-fetcher';

import { IronBankComptroller, IronBankContractFactory, IronBankCToken } from '../contracts';

@PositionTemplate()
export class OptimismIronBankSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xe0b57feed45e7d908f2d0dacd26f113cf26715bf';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IronBankContractFactory) protected readonly contractFactory: IronBankContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.ironBankCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.ironBankComptroller({ address, network: this.network });
  }

  getMarkets(contract: IronBankComptroller) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: IronBankCToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: IronBankCToken) {
    return contract.exchangeRateCurrent();
  }

  async getSupplyRate(contract: IronBankCToken) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
