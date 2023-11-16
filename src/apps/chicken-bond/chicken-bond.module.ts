import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ChickenBondViemContractFactory } from './contracts';
import { EthereumChickenBondBlusdTokenFetcher } from './ethereum/chicken-bond.blusd.token-fetcher';
import { EthereumChickenBondBondContractPositionFetcher } from './ethereum/chicken-bond.bond.contract-position-fetcher';

@Module({
  providers: [
    ChickenBondViemContractFactory,
    EthereumChickenBondBlusdTokenFetcher,
    EthereumChickenBondBondContractPositionFetcher,
  ],
})
export class ChickenBondAppModule extends AbstractApp() {}
