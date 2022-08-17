import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AvalancheIronBankBalanceFetcher } from './avalanche/iron-bank.balance-fetcher';
import { AvalancheIronBankBorrowContractPositionFetcher } from './avalanche/iron-bank.borrow.contract-position-fetcher';
import { AvalancheIronBankSupplyTokenFetcher } from './avalanche/iron-bank.supply.token-fetcher';
import { OptimismIronBankBalanceFetcher } from './optimism/iron-bank.balance-fetcher';
import { OptimismIronBankBorrowContractPositionFetcher } from './optimism/iron-bank.borrow.contract-position-fetcher';
import { OptimismIronBankSupplyTokenFetcher } from './optimism/iron-bank.supply.token-fetcher';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBalanceFetcher } from './ethereum/iron-bank.balance-fetcher';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/iron-bank.borrow.contract-position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/iron-bank.supply.token-fetcher';
import { FantomIronBankBalanceFetcher } from './fantom/iron-bank.balance-fetcher';
import { FantomIronBankBorrowContractPositionFetcher } from './fantom/iron-bank.borrow.contract-position-fetcher';
import { FantomIronBankSupplyTokenFetcher } from './fantom/iron-bank.supply.token-fetcher';
import { IronBankAppDefinition, IRON_BANK_DEFINITION } from './iron-bank.definition';

@Register.AppModule({
  appId: IRON_BANK_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    IronBankAppDefinition,
    IronBankContractFactory,
    EthereumIronBankBalanceFetcher,
    EthereumIronBankSupplyTokenFetcher,
    EthereumIronBankBorrowContractPositionFetcher,
    FantomIronBankBalanceFetcher,
    FantomIronBankSupplyTokenFetcher,
    FantomIronBankBorrowContractPositionFetcher,
    AvalancheIronBankBalanceFetcher,
    AvalancheIronBankSupplyTokenFetcher,
    AvalancheIronBankBorrowContractPositionFetcher,
    OptimismIronBankBalanceFetcher,
    OptimismIronBankSupplyTokenFetcher,
    OptimismIronBankBorrowContractPositionFetcher,
    IronBankContractFactory,
  ],
})
export class IronBankAppModule extends AbstractApp() {}
