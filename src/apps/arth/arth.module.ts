import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArthViemContractFactory } from './contracts';
import { EthereumArthStabilityPoolContractPositionFetcher } from './ethereum/arth.stability-pool.contract-position-fetcher';
import { EthereumArthTroveContractPositionFetcher } from './ethereum/arth.trove.contract-position-fetcher';

@Module({
  providers: [
    ArthViemContractFactory,
    EthereumArthStabilityPoolContractPositionFetcher,
    EthereumArthTroveContractPositionFetcher,
  ],
})
export class ArthAppModule extends AbstractApp() {}
