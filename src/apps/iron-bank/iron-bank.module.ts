import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AvalancheIronBankBalanceFetcher } from './avalanche/iron-bank.balance-fetcher';
import { AvalancheIronBankBorrowContractPositionFetcher } from './avalanche/iron-bank.borrow.contract-position-fetcher';
import { AvalancheIronBankSupplyTokenFetcher } from './avalanche/iron-bank.supply.token-fetcher';
import { AvalancheIronBankTvlFetcher } from './avalanche/iron-bank.tvl-fetcher';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBalanceFetcher } from './ethereum/iron-bank.balance-fetcher';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/iron-bank.borrow.contract-position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/iron-bank.supply.token-fetcher';
import { EthereumIronBankTvlFetcher } from './ethereum/iron-bank.tvl-fetcher';
import { FantomIronBankBalanceFetcher } from './fantom/iron-bank.balance-fetcher';
import { FantomIronBankBorrowContractPositionFetcher } from './fantom/iron-bank.borrow.contract-position-fetcher';
import { FantomIronBankSupplyTokenFetcher } from './fantom/iron-bank.supply.token-fetcher';
import { FantomIronBankTvlFetcher } from './fantom/iron-bank.tvl-fetcher';
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
    EthereumIronBankTvlFetcher,
    FantomIronBankBalanceFetcher,
    FantomIronBankSupplyTokenFetcher,
    FantomIronBankBorrowContractPositionFetcher,
    FantomIronBankTvlFetcher,
    AvalancheIronBankBalanceFetcher,
    AvalancheIronBankSupplyTokenFetcher,
    AvalancheIronBankBorrowContractPositionFetcher,
    AvalancheIronBankTvlFetcher,
    IronBankContractFactory,
  ],
})
export class IronBankAppModule extends AbstractApp() {}
