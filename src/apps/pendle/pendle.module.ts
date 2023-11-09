import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PendleViemContractFactory } from './contracts';
import { EthereumPendleFarmContractPositionFetcher } from './ethereum/pendle.farm.contract-position-fetcher';
import { EthereumPendleOwnershipTokenFetcher } from './ethereum/pendle.ownership.token-fetcher';
import { EthereumPendleYieldTokenFetcher } from './ethereum/pendle.yield.token-fetcher';

@Module({
  providers: [
    PendleViemContractFactory,
    EthereumPendleYieldTokenFetcher,
    EthereumPendleOwnershipTokenFetcher,
    EthereumPendleFarmContractPositionFetcher,
  ],
})
export class PendleAppModule extends AbstractApp() {}
