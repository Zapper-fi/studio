import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumNotionalFinanceV3BorrowContractPositionFetcher } from './arbitrum/notional-finance-v3.borrow.contract-position-fetcher';
import { ArbitrumNotionalFinanceV3FCashTokenFetcher } from './arbitrum/notional-finance-v3.f-cash.token-fetcher';
import { ArbitrumNotionalFinanceV3NTokenTokenFetcher } from './arbitrum/notional-finance-v3.n-token.token-fetcher';
import { ArbitrumNotionalFinanceV3PCashTokenFetcher } from './arbitrum/notional-finance-v3.p-cash.token-fetcher';
import { ArbitrumNotionalFinanceV3PDebtTokenFetcher } from './arbitrum/notional-finance-v3.p-debt.token-fetcher';
import { ArbitrumNotionalFinanceV3SupplyContractPositionFetcher } from './arbitrum/notional-finance-v3.supply.contract-position-fetcher';
import { NotionalFinanceV3ViemContractFactory } from './contracts';

@Module({
  providers: [
    NotionalFinanceV3ViemContractFactory,
    // Arbitrum
    ArbitrumNotionalFinanceV3PCashTokenFetcher,
    ArbitrumNotionalFinanceV3PDebtTokenFetcher,
    ArbitrumNotionalFinanceV3NTokenTokenFetcher,
    ArbitrumNotionalFinanceV3FCashTokenFetcher,
    ArbitrumNotionalFinanceV3SupplyContractPositionFetcher,
    ArbitrumNotionalFinanceV3BorrowContractPositionFetcher,
  ],
})
export class NotionalFinanceV3AppModule extends AbstractApp() {}
