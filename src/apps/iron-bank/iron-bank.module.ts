import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AvalancheIronBankBalanceFetcher } from './avalanche/ironBank.balance-fetcher';
import { AvalancheIronBankBorrowContractPositionFetcher } from './avalanche/ironBank.borrow.contract-position-fetcher';
import { AvalancheIronBankSupplyTokenFetcher } from './avalanche/ironBank.supply.token-fetcher';
import { AvalancheIronBankTvlFetcher } from './avalanche/ironBank.tvl-fetcher';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBalanceFetcher } from './ethereum/ironBank.balance-fetcher';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/ironBank.borrow.contract-position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/ironBank.supply.token-fetcher';
import { EthereumIronBankTvlFetcher } from './ethereum/ironBank.tvl-fetcher';
import { FantomIronBankBalanceFetcher } from './fantom/ironBank.balance-fetcher';
import { FantomIronBankBorrowContractPositionFetcher } from './fantom/ironBank.borrow.contract-position-fetcher';
import { FantomIronBankSupplyTokenFetcher } from './fantom/ironBank.supply.token-fetcher';
import { FantomIronBankTvlFetcher } from './fantom/ironBank.tvl-fetcher';
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
