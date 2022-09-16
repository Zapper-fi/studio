import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundBorrowContractPositionFetcher } from '~apps/compound/common/compound.borrow.contract-position-fetcher';

import { CozyFinanceContractFactory } from '../contracts';
import { CozyFinanceComptroller, CozyFinanceCToken } from '../contracts/ethers';

@PositionTemplate()
export class EthereumCozyFinanceBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  CozyFinanceCToken,
  CozyFinanceComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x895879b2c1fbb6ccfcd101f2d3f3c76363664f92';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CozyFinanceContractFactory) protected readonly contractFactory: CozyFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.cozyFinanceCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.cozyFinanceComptroller({ address, network: this.network });
  }

  getMarkets(contract: CozyFinanceComptroller) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: CozyFinanceCToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: CozyFinanceCToken) {
    return contract.exchangeRateCurrent();
  }

  async getBorrowRate(contract: CozyFinanceCToken) {
    return contract.borrowRatePerBlock().catch(() => 0);
  }

  getCTokenSupply(contract: CozyFinanceCToken) {
    return contract.totalSupply();
  }

  getCTokenDecimals(contract: CozyFinanceCToken) {
    return contract.decimals();
  }

  getBorrowBalance({ address, contract }: { address: string; contract: CozyFinanceCToken }) {
    return contract.borrowBalanceCurrent(address);
  }

  getCash(contract: CozyFinanceCToken) {
    return contract.getCash();
  }
}
