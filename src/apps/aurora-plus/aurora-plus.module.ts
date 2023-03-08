import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraAuroraPlusStakeContractPositionFetcher } from './aurora/aurora-plus.stake.contract-position-fetcher';
import { AuroraPlusContractFactory } from './contracts';

@Module({
  providers: [
    AuroraPlusContractFactory,
    // Aurora
    AuroraAuroraPlusStakeContractPositionFetcher,
  ],
})
export class AuroraPlusAppModule extends AbstractApp() {}
