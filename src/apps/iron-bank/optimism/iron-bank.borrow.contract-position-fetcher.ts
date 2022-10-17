import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundBorrowContractPositionFetcher } from '~apps/compound/common/compound.borrow.contract-position-fetcher';

import { IronBankComptroller, IronBankContractFactory, IronBankCToken } from '../contracts';

@PositionTemplate()
export class OptimismIronBankBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
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

  async getBorrowRate(contract: IronBankCToken) {
    return contract.borrowRatePerBlock().catch(() => 0);
  }

  getCTokenSupply(contract: IronBankCToken) {
    return contract.totalSupply();
  }

  getCTokenDecimals(contract: IronBankCToken) {
    return contract.decimals();
  }

  getBorrowBalance({ address, contract }: { address: string; contract: IronBankCToken }) {
    return contract.borrowBalanceCurrent(address);
  }

  getCash(contract: IronBankCToken) {
    return contract.getCash();
  }
}
