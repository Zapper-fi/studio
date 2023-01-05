import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ChickenBondAppDefinition } from './chicken-bond.definition';
import { ChickenBondContractFactory } from './contracts';
import { EthereumChickenBondBlusdTokenFetcher } from './ethereum/chicken-bond.blusd.token-fetcher';
import { EthereumChickenBondBondContractPositionFetcher } from './ethereum/chicken-bond.bond.contract-position-fetcher';

@Module({
  providers: [
    ChickenBondAppDefinition,
    ChickenBondContractFactory,
    EthereumChickenBondBlusdTokenFetcher,
    EthereumChickenBondBondContractPositionFetcher,
  ],
})
export class ChickenBondAppModule extends AbstractApp() {}
