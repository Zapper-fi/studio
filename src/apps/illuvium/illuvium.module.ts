import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IlluviumContractFactory } from './contracts';
import { EthereumIlluviumBalanceFetcher } from './ethereum/illuvium.balance-fetcher';
import { EthereumIlluviumFarmV2ContractPositionFetcher } from './ethereum/illuvium.farm-v2.contract-position-fetcher';
import { EthereumIlluviumFarmContractPositionFetcher } from './ethereum/illuvium.farm.contract-position-fetcher';
import { IlluviumAppDefinition } from './illuvium.definition';

@Module({
  providers: [
    IlluviumAppDefinition,
    IlluviumContractFactory,
    EthereumIlluviumFarmContractPositionFetcher,
    EthereumIlluviumFarmV2ContractPositionFetcher,
    EthereumIlluviumBalanceFetcher,
  ],
})
export class IlluviumAppModule extends AbstractApp() {}
