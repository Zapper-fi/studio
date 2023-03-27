import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDolomiteDolomiteBalancesContractPositionFetcher } from './arbitrum/dolomite.dolomite_balances.contract-position-fetcher';
import { ArbitrumDolomiteBorrowPositionsContractPositionFetcher } from './arbitrum/dolomite.borrow_positions.contract-position-fetcher';
import { DolomiteContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumDolomiteDolomiteBalancesContractPositionFetcher,
    ArbitrumDolomiteBorrowPositionsContractPositionFetcher,
    DolomiteContractFactory,
  ],
})
export class DolomiteAppModule extends AbstractApp() {}
