import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AelinViemContractFactory } from './contracts';
import { EthereumAelinPoolTokenFetcher } from './ethereum/aelin.pool.token-fetcher';
import { OptimismAelinFarmContractPositionFetcher } from './optimism/aelin.farm.contract-position-fetcher';
import { OptimismAelinPoolTokenFetcher } from './optimism/aelin.pool.token-fetcher';

@Module({
  providers: [
    AelinViemContractFactory,
    // Ethereum
    EthereumAelinPoolTokenFetcher,
    // Optimism
    OptimismAelinPoolTokenFetcher,
    OptimismAelinFarmContractPositionFetcher,
  ],
})
export class AelinAppModule extends AbstractApp() {}
