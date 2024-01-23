import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PodsYieldViemContractFactory } from './contracts';
import { EthereumPodsYieldQueueContractPositionFetcher } from './ethereum/pods-yield.queue.contract-position-fetcher';

@Module({
  providers: [PodsYieldViemContractFactory, EthereumPodsYieldQueueContractPositionFetcher],
})
export class PodsYieldAppModule extends AbstractApp() {}
