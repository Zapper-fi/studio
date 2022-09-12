import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundBorrowContractPositionFetcher } from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { IronBankComptroller, IronBankContractFactory, IronBankCToken } from '../contracts';
import IRON_BANK_DEFINITION from '../iron-bank.definition';

@Injectable()
export class AvalancheIronBankBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  appId = IRON_BANK_DEFINITION.id;
  groupId = IRON_BANK_DEFINITION.groups.borrow.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0x2ee80614ccbc5e28654324a66a396458fa5cd7cc';

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
