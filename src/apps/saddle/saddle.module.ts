import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SaddleViemContractFactory } from './contracts';
import { EthereumSaddleCommunalFarmContractPositionFetcher } from './ethereum/saddle.communal-farm.contract-position-fetcher';
import { EthereumSaddleMiniChefV2FarmContractPositionFetcher } from './ethereum/saddle.mini-chef-v2-farm.contract-position-fetcher';
import { EthereumSaddlePoolTokenFetcher } from './ethereum/saddle.pool.token-fetcher';

@Module({
  providers: [
    SaddleViemContractFactory,
    // Ethereum
    EthereumSaddleCommunalFarmContractPositionFetcher,
    EthereumSaddleMiniChefV2FarmContractPositionFetcher,
    EthereumSaddlePoolTokenFetcher,
  ],
})
export class SaddleAppModule extends AbstractApp() {}
