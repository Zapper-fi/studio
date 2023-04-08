import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDolomiteBorrowPositionsContractPositionFetcher } from './arbitrum/dolomite.borrow_positions.contract-position-fetcher';
import { ArbitrumDolomiteDolomiteBalancesContractPositionFetcher } from './arbitrum/dolomite.dolomite_balances.contract-position-fetcher';
import { ArbitrumDolomitePoolsTokenFetcher } from './arbitrum/dolomite.pools.token-fetcher';
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
