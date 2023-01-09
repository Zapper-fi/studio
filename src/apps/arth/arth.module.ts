import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArthAppDefinition } from './arth.definition';
import { ArthContractFactory } from './contracts';
import { EthereumArthStabilityPoolContractPositionFetcher } from './ethereum/arth.stability-pool.contract-position-fetcher';
import { EthereumArthTroveContractPositionFetcher } from './ethereum/arth.trove.contract-position-fetcher';

@Module({
  providers: [
    ArthAppDefinition,
    ArthContractFactory,
    EthereumArthStabilityPoolContractPositionFetcher,
    EthereumArthTroveContractPositionFetcher,
  ],
})
export class ArthAppModule extends AbstractApp() {}
