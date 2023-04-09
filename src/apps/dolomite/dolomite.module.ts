import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { ArbitrumDolomitePoolsTokenFetcher } from '~apps/dolomite/arbitrum/dolomite.pools.token-fetcher';

import { ArbitrumDolomiteBorrowPositionsContractPositionFetcher } from './arbitrum/dolomite.borrow_positions.contract-position-fetcher';
import { ArbitrumDolomiteDolomiteBalancesContractPositionFetcher } from './arbitrum/dolomite.dolomite_balances.contract-position-fetcher';
import { DolomiteContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumDolomiteBorrowPositionsContractPositionFetcher,
    ArbitrumDolomiteDolomiteBalancesContractPositionFetcher,
    ArbitrumDolomitePoolsTokenFetcher,
    DolomiteContractFactory,
  ],
})
export class DolomiteAppModule extends AbstractApp() {}
