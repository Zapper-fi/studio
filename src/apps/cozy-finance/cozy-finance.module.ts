import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCozyFinanceBorrowContractPositionFetcher } from './arbitrum/cozy-finance.borrow.contract-position-fetcher';
import { ArbitrumCozyFinancePositionPresenter } from './arbitrum/cozy-finance.position-presenter';
import { ArbitrumCozyFinanceSupplyTokenFetcher } from './arbitrum/cozy-finance.supply.token-fetcher';
import { CozyFinanceViemContractFactory } from './contracts';
import { EthereumCozyFinanceBorrowContractPositionFetcher } from './ethereum/cozy-finance.borrow.contract-position-fetcher';
import { EthereumCozyFinancePositionPresenter } from './ethereum/cozy-finance.position-presenter';
import { EthereumCozyFinanceSupplyTokenFetcher } from './ethereum/cozy-finance.supply.token-fetcher';

@Module({
  providers: [
    CozyFinanceViemContractFactory,
    // Arbitrum
    ArbitrumCozyFinanceBorrowContractPositionFetcher,
    ArbitrumCozyFinancePositionPresenter,
    ArbitrumCozyFinanceSupplyTokenFetcher,
    // Ethereum
    EthereumCozyFinancePositionPresenter,
    EthereumCozyFinanceBorrowContractPositionFetcher,
    EthereumCozyFinanceSupplyTokenFetcher,
  ],
})
export class CozyFinanceAppModule extends AbstractApp() {}
