import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PodsYieldContractFactory } from './contracts';
import { EthereumPodsYieldQueueContractPositionFetcher } from './ethereum/pods-yield.queue.contract-position-fetcher';
import { EthereumPodsYieldStrategyTokenFetcher } from './ethereum/pods-yield.strategy.token-fetcher';
import { PodsYieldAppDefinition } from './pods-yield.definition';

@Module({
  providers: [
    EthereumPodsYieldQueueContractPositionFetcher,
    EthereumPodsYieldStrategyTokenFetcher,

    PodsYieldContractFactory,
  ],
})
export class PodsYieldAppModule extends AbstractApp() {}
