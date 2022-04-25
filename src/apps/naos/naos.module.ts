import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { NaosContractFactory } from './contracts';
import { EthereumNaosBalanceFetcher } from './ethereum/naos.balance-fetcher';
import { EthereumNaosFarmContractPositionFetcher } from './ethereum/naos.farm.contract-position-fetcher';
import { NaosAppDefinition } from './naos.definition';

@Module({
  providers: [
    NaosAppDefinition,
    NaosContractFactory,
    EthereumNaosFarmContractPositionFetcher,
    EthereumNaosBalanceFetcher,
  ],
  exports: [NaosContractFactory],
})
export class NaosAppModule extends AbstractApp() {}
