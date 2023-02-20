import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RedactedEarningsResolver } from './common/redacted.earnings-resolver';
import { RedactedCartelContractFactory } from './contracts';
import { EthereumRedactedCartelBondContractPositionFetcher } from './ethereum/redacted-cartel.bond.contract-position-fetcher';
import { EthereumRedactedCartelRevenueLockContractPositionFetcher } from './ethereum/redacted-cartel.revenue-lock.contract-position-fetcher';
import { EthereumRedactedCartelWxBtrflyV1TokenFetcher } from './ethereum/redacted-cartel.wx-btrfly-v1.token-fetcher';
import { EthereumRedactedCartelWxBtrflyTokenFetcher } from './ethereum/redacted-cartel.wx-btrfly.token-fetcher';
import { EthereumRedactedCartelXBtrflyTokenFetcher } from './ethereum/redacted-cartel.x-btrfly.token-fetcher';

@Module({
  providers: [
    RedactedCartelContractFactory,
    EthereumRedactedCartelXBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyV1TokenFetcher,
    EthereumRedactedCartelBondContractPositionFetcher,
    EthereumRedactedCartelRevenueLockContractPositionFetcher,
    RedactedEarningsResolver,
  ],
})
export class RedactedCartelAppModule extends AbstractApp() {}
