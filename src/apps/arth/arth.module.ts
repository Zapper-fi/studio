import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArthContractFactory } from './contracts';
import { EthereumArthStabilityPoolContractPositionFetcher } from './ethereum/arth.stability-pool.contract-position-fetcher';
import { EthereumArthTroveContractPositionFetcher } from './ethereum/arth.trove.contract-position-fetcher';

@Module({
  providers: [
    ArthContractFactory,
    EthereumArthStabilityPoolContractPositionFetcher,
    EthereumArthTroveContractPositionFetcher,
  ],
})
export class ArthAppModule extends AbstractApp() {}
