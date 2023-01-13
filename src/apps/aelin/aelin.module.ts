import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AelinContractFactory } from './contracts';
import { EthereumAelinPoolTokenFetcher } from './ethereum/aelin.pool.token-fetcher';
import { OptimismAelinFarmContractPositionFetcher } from './optimism/aelin.farm.contract-position-fetcher';
import { OptimismAelinPoolTokenFetcher } from './optimism/aelin.pool.token-fetcher';
import { OptimismAelinVAelinTokenFetcher } from './optimism/aelin.v-aelin.token-fetcher';

@Module({
  providers: [
    AelinContractFactory,
    // Ethereum
    EthereumAelinPoolTokenFetcher,
    // Optimism
    OptimismAelinPoolTokenFetcher,
    OptimismAelinVAelinTokenFetcher,
    OptimismAelinFarmContractPositionFetcher,
  ],
})
export class AelinAppModule extends AbstractApp() {}
