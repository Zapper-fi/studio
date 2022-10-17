import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheIronBankBorrowContractPositionFetcher } from './avalanche/iron-bank.borrow.contract-position-fetcher';
import { AvalancheIronBankPositionPresenter } from './avalanche/iron-bank.position-fetcher';
import { AvalancheIronBankSupplyTokenFetcher } from './avalanche/iron-bank.supply.token-fetcher';
import { IronBankContractFactory } from './contracts';
import { EthereumIronBankBorrowContractPositionFetcher } from './ethereum/iron-bank.borrow.contract-position-fetcher';
import { EthereumIronBankPositionPresenter } from './ethereum/iron-bank.position-fetcher';
import { EthereumIronBankSupplyTokenFetcher } from './ethereum/iron-bank.supply.token-fetcher';
import { FantomIronBankBorrowContractPositionFetcher } from './fantom/iron-bank.borrow.contract-position-fetcher';
import { FantomIronBankPositionPresenter } from './fantom/iron-bank.position-presenter';
import { FantomIronBankSupplyTokenFetcher } from './fantom/iron-bank.supply.token-fetcher';
import { IronBankAppDefinition, IRON_BANK_DEFINITION } from './iron-bank.definition';
import { OptimismIronBankBorrowContractPositionFetcher } from './optimism/iron-bank.borrow.contract-position-fetcher';
import { OptimismIronBankPositionPresenter } from './optimism/iron-bank.position-presenter';
import { OptimismIronBankSupplyTokenFetcher } from './optimism/iron-bank.supply.token-fetcher';

@Register.AppModule({
  appId: IRON_BANK_DEFINITION.id,
  providers: [
    AvalancheIronBankBorrowContractPositionFetcher,
    AvalancheIronBankPositionPresenter,
    AvalancheIronBankSupplyTokenFetcher,
    EthereumIronBankBorrowContractPositionFetcher,
    EthereumIronBankPositionPresenter,
    EthereumIronBankSupplyTokenFetcher,
    FantomIronBankBorrowContractPositionFetcher,
    FantomIronBankPositionPresenter,
    FantomIronBankSupplyTokenFetcher,
    IronBankAppDefinition,
    IronBankContractFactory,
    IronBankContractFactory,
    OptimismIronBankBorrowContractPositionFetcher,
    OptimismIronBankPositionPresenter,
    OptimismIronBankSupplyTokenFetcher,
  ],
})
export class IronBankAppModule extends AbstractApp() {}
