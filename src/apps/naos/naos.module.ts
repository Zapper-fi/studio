import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { NaosContractFactory } from './contracts';
import { EthereumNaosFarmContractPositionFetcher } from './ethereum/naos.farm.contract-position-fetcher';
import { NaosAppDefinition } from './naos.definition';

@Module({
  providers: [NaosAppDefinition, NaosContractFactory, EthereumNaosFarmContractPositionFetcher],
})
export class NaosAppModule extends AbstractApp() {}
