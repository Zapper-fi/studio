import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundSupplyTokenFetcher } from '~apps/compound/common/compound.supply.token-fetcher';
import { Network } from '~types/network.interface';

import { IronBankComptroller, IronBankContractFactory, IronBankCToken } from '../contracts';
import IRON_BANK_DEFINITION from '../iron-bank.definition';

@Injectable()
export class FantomIronBankSupplyTokenFetcher extends CompoundSupplyTokenFetcher<IronBankCToken, IronBankComptroller> {
  appId = IRON_BANK_DEFINITION.id;
  groupId = IRON_BANK_DEFINITION.groups.supply.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0x4250a6d3bd57455d7c6821eecb6206f507576cd2';

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
