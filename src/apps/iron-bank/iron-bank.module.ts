import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IronBankAppDefinition, IRON_BANK_DEFINITION } from './iron-bank.definition';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBalanceFetcher } from './ethereum/ironBank.balance-fetcher';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/ironBank.borrow.contract-position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/ironBank.supply.token-fetcher';
import { EthereumIronBankTvlFetcher } from './ethereum/ironBank.tvl-fetcher';
import { IronBankBorrowContractPositionHelper } from './helper/ironBank.borrow.contract-position-helper';
import { IronBankLendingBalanceHelper } from './helper/ironBank.lending.balance-helper';
import { IronBankLendingMetaHelper } from './helper/ironBank.lending.meta-helper';
import { IronBankSupplyTokenHelper } from './helper/ironBank.supply.token-helper';
import { IronBankTvlHelper } from './helper/ironBank.tvl-helper';

@Register.AppModule({
  appId: IRON_BANK_DEFINITION.id,
  providers: [
    IronBankAppDefinition,
    IronBankContractFactory,
    EthereumIronBankBalanceFetcher,
    EthereumIronBankSupplyTokenFetcher,
    EthereumIronBankBorrowContractPositionFetcher,
    EthereumIronBankTvlFetcher,
    // Helpers
    IronBankLendingBalanceHelper,
    IronBankLendingMetaHelper,
    IronBankSupplyTokenHelper,
    IronBankBorrowContractPositionHelper,
    IronBankContractFactory,
    IronBankTvlHelper,
  ],
  exports: [
    IronBankLendingBalanceHelper,
    IronBankLendingMetaHelper,
    IronBankSupplyTokenHelper,
    IronBankBorrowContractPositionHelper,
    IronBankContractFactory,
    IronBankTvlHelper,
  ],
})
export class IronBankAppModule extends AbstractApp() {}
