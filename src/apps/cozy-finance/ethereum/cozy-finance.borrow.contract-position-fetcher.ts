import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundBorrowContractPositionFetcher } from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { CozyFinanceContractFactory } from '../contracts';
import { CozyFinanceComptroller, CozyFinanceCToken } from '../contracts/ethers';
import { COZY_FINANCE_DEFINITION } from '../cozy-finance.definition';

@Injectable()
export class EthereumCozyFinanceBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  CozyFinanceCToken,
  CozyFinanceComptroller
> {
  appId = COZY_FINANCE_DEFINITION.id;
  groupId = COZY_FINANCE_DEFINITION.groups.borrow.id;
  network = Network.ETHEREUM_MAINNET;
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
