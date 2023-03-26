import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDolomiteBalancesContractPositionFetcher } from './arbitrum/dolomite.balances.contract-position-fetcher';
import { ArbitrumDolomitePositionsContractPositionFetcher } from './arbitrum/dolomite.positions.contract-position-fetcher';
import { DolomiteContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumDolomiteBalancesContractPositionFetcher,
    ArbitrumDolomitePositionsContractPositionFetcher,
    DolomiteContractFactory,
  ],
})
export class DolomiteAppModule extends AbstractApp() {}
