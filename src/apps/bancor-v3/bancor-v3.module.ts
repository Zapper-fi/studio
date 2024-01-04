import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BancorV3ViemContractFactory } from './contracts';
import { EthereumBancorV3FarmContractPositionFetcher } from './ethereum/bancor-v3.farm.contract-position-fetcher';
import { EthereumBancorV3PoolTokenFetcher } from './ethereum/bancor-v3.pool.token-fetcher';

@Module({
  providers: [
    BancorV3ViemContractFactory,
    EthereumBancorV3FarmContractPositionFetcher,
    EthereumBancorV3PoolTokenFetcher,
  ],
})
export class BancorV3AppModule extends AbstractApp() {}
