import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RedactedCartelContractFactory } from './contracts';
import { EthereumRedactedCartelBondContractPositionFetcher } from './ethereum/redacted-cartel.bond.contract-position-fetcher';
import { EthereumRedactedCartelRevenueLockContractPositionFetcher } from './ethereum/redacted-cartel.revenue-lock.contract-position-fetcher';
import { EthereumRedactedCartelWxBtrflyV1TokenFetcher } from './ethereum/redacted-cartel.wx-btrfly-v1.token-fetcher';
import { EthereumRedactedCartelWxBtrflyTokenFetcher } from './ethereum/redacted-cartel.wx-btrfly.token-fetcher';
import { EthereumRedactedCartelXBtrflyTokenFetcher } from './ethereum/redacted-cartel.x-btrfly.token-fetcher';
import { RedactedCartelAppDefinition } from './redacted-cartel.definition';

@Module({
  providers: [
    RedactedCartelAppDefinition,
    RedactedCartelContractFactory,
    EthereumRedactedCartelXBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyTokenFetcher,
    EthereumRedactedCartelWxBtrflyV1TokenFetcher,
    EthereumRedactedCartelBondContractPositionFetcher,
    EthereumRedactedCartelRevenueLockContractPositionFetcher,
  ],
})
export class RedactedCartelAppModule extends AbstractApp() {}
