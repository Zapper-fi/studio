import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArtGobblersAppDefinition } from './art-gobblers.definition';
import { ArtGobblersContractFactory } from './contracts';
import { EthereumArGobblersFactoryContractPositionFetcher } from './ethereum/art-gobblers.factory.contract-position-fetcher';

@Module({
  providers: [ArtGobblersAppDefinition, ArtGobblersContractFactory, EthereumArGobblersFactoryContractPositionFetcher],
})
export class ArtGobblersAppModule extends AbstractApp() {}
