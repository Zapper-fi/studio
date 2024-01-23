import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IlluviumViemContractFactory } from './contracts';
import { EthereumIlluviumFarmV2ContractPositionFetcher } from './ethereum/illuvium.farm-v2.contract-position-fetcher';
import { EthereumIlluviumFarmContractPositionFetcher } from './ethereum/illuvium.farm.contract-position-fetcher';

@Module({
  providers: [
    IlluviumViemContractFactory,
    EthereumIlluviumFarmContractPositionFetcher,
    EthereumIlluviumFarmV2ContractPositionFetcher,
  ],
})
export class IlluviumAppModule extends AbstractApp() {}
