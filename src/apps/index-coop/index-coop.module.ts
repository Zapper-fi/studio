import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IndexCoopViemContractFactory } from './contracts';
import { EthereumIndexCoopFarmContractPositionFetcher } from './ethereum/index-coop.farm.contract-position-fetcher';
import { EthereumIndexCoopIndexTokenFetcher } from './ethereum/index-coop.index.token-fetcher';

@Module({
  providers: [
    IndexCoopViemContractFactory,
    EthereumIndexCoopIndexTokenFetcher,
    EthereumIndexCoopFarmContractPositionFetcher,
  ],
})
export class IndexCoopAppModule extends AbstractApp() {}
