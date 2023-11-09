import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IlluviumViemContractFactory } from './contracts';
import { EthereumIlluviumFarmV2ContractPositionFetcher } from './ethereum/illuvium.farm-v2.contract-position-fetcher';
import { EthereumIlluviumFarmContractPositionFetcher } from './ethereum/illuvium.farm.contract-position-fetcher';
import { EthereumIlluviumSIlv2TokenFetcher } from './ethereum/illuvium.s-ilv2.token-fetcher';

@Module({
  providers: [
    IlluviumContractFactory,
    EthereumIlluviumFarmContractPositionFetcher,
    EthereumIlluviumFarmV2ContractPositionFetcher,
    EthereumIlluviumSIlv2TokenFetcher,
  ],
})
export class IlluviumAppModule extends AbstractApp() {}
