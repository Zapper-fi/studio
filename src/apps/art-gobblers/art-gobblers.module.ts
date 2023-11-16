import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArtGobblersViemContractFactory } from './contracts';
import { EthereumArGobblersFactoryContractPositionFetcher } from './ethereum/art-gobblers.factory.contract-position-fetcher';

@Module({
  providers: [ArtGobblersViemContractFactory, EthereumArGobblersFactoryContractPositionFetcher],
})
export class ArtGobblersAppModule extends AbstractApp() {}
