import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { ArbitrumDolomitePoolsTokenFetcher } from '~apps/dolomite/arbitrum/dolomite.pools.token-fetcher';

import { ArbitrumDolomiteBorrowContractPositionFetcher } from './arbitrum/dolomite.borrow.contract-position-fetcher';
import { ArbitrumDolomiteDolomiteContractPositionFetcher } from './arbitrum/dolomite.dolomite.contract-position-fetcher';
import { DolomiteViemContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumDolomiteBorrowContractPositionFetcher,
    ArbitrumDolomiteDolomiteContractPositionFetcher,
    ArbitrumDolomitePoolsTokenFetcher,
    DolomiteViemContractFactory,
  ],
})
export class DolomiteAppModule extends AbstractApp() {}
