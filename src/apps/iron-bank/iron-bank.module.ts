import { Module } from '@nestjs/common';

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
import { OptimismIronBankBorrowContractPositionFetcher } from './optimism/iron-bank.borrow.contract-position-fetcher';
import { OptimismIronBankPositionPresenter } from './optimism/iron-bank.position-presenter';
import { OptimismIronBankSupplyTokenFetcher } from './optimism/iron-bank.supply.token-fetcher';

@Module({
  providers: [
    IronBankContractFactory,
    // Avalanche
    AvalancheIronBankBorrowContractPositionFetcher,
    AvalancheIronBankPositionPresenter,
    AvalancheIronBankSupplyTokenFetcher,
    // Ethereum
    EthereumIronBankBorrowContractPositionFetcher,
    EthereumIronBankPositionPresenter,
    EthereumIronBankSupplyTokenFetcher,
    // Fantom
    FantomIronBankBorrowContractPositionFetcher,
    FantomIronBankPositionPresenter,
    FantomIronBankSupplyTokenFetcher,
    // Optimism
    OptimismIronBankBorrowContractPositionFetcher,
    OptimismIronBankPositionPresenter,
    OptimismIronBankSupplyTokenFetcher,
  ],
})
export class IronBankAppModule extends AbstractApp() {}
