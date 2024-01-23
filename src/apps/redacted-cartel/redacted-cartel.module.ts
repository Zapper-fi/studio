import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RedactedEarningsResolver } from './common/redacted.earnings-resolver';
import { RedactedCartelViemContractFactory } from './contracts';
import { EthereumRedactedCartelBondContractPositionFetcher } from './ethereum/redacted-cartel.bond.contract-position-fetcher';
import { EthereumRedactedCartelRevenueLockContractPositionFetcher } from './ethereum/redacted-cartel.revenue-lock.contract-position-fetcher';

@Module({
  providers: [
    RedactedCartelViemContractFactory,
    EthereumRedactedCartelBondContractPositionFetcher,
    EthereumRedactedCartelRevenueLockContractPositionFetcher,
    RedactedEarningsResolver,
  ],
})
export class RedactedCartelAppModule extends AbstractApp() {}
