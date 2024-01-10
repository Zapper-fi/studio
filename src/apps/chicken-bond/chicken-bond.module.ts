import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ChickenBondViemContractFactory } from './contracts';
import { EthereumChickenBondBondContractPositionFetcher } from './ethereum/chicken-bond.bond.contract-position-fetcher';

@Module({
  providers: [ChickenBondViemContractFactory, EthereumChickenBondBondContractPositionFetcher],
})
export class ChickenBondAppModule extends AbstractApp() {}
