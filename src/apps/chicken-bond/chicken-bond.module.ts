import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ChickenBondContractFactory } from './contracts';
import { EthereumChickenBondBlusdTokenFetcher } from './ethereum/chicken-bond.blusd.token-fetcher';
import { EthereumChickenBondBondContractPositionFetcher } from './ethereum/chicken-bond.bond.contract-position-fetcher';

@Module({
  providers: [
    ChickenBondContractFactory,
    EthereumChickenBondBlusdTokenFetcher,
    EthereumChickenBondBondContractPositionFetcher,
  ],
})
export class ChickenBondAppModule extends AbstractApp() {}
