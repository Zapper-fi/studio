import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IronBankAppDefinition, IRON_BANK_DEFINITION } from './iron-bank.definition';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBalanceFetcher } from './ethereum/ironBank.balance-fetcher';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/ironBank.borrow.contract-position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/ironBank.supply.token-fetcher';
import { EthereumIronBankTvlFetcher } from './ethereum/ironBank.tvl-fetcher';
import { FantomIronBankBalanceFetcher } from './fantom/ironBank.balance-fetcher';
import { FantomIronBankBorrowContractPositionFetcher } from './fantom/ironBank.borrow.contract-position-fetcher';
import { FantomIronBankSupplyTokenFetcher } from './fantom/ironBank.supply.token-fetcher';
import { FantomIronBankTvlFetcher } from './fantom/ironBank.tvl-fetcher';
import { AvalancheIronBankBalanceFetcher } from './avalanche/ironBank.balance-fetcher';
import { AvalancheIronBankBorrowContractPositionFetcher } from './avalanche/ironBank.borrow.contract-position-fetcher';
import { AvalancheIronBankSupplyTokenFetcher } from './avalanche/ironBank.supply.token-fetcher';
import { AvalancheIronBankTvlFetcher } from './avalanche/ironBank.tvl-fetcher';
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
    FantomIronBankBalanceFetcher,
    FantomIronBankSupplyTokenFetcher,
    FantomIronBankBorrowContractPositionFetcher,
    FantomIronBankTvlFetcher,
    AvalancheIronBankBalanceFetcher,
    AvalancheIronBankSupplyTokenFetcher,
    AvalancheIronBankBorrowContractPositionFetcher,
    AvalancheIronBankTvlFetcher,
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
