import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheYieldyakFarmContractPositionFetcher } from './avalanche/yield-yak.farm.contract-position-fetcher';
import { AvalancheYieldyakVaultTokenFetcher } from './avalanche/yield-yak.vault.token-fetcher';
import { YieldYakContractFactory } from './contracts';
import { YieldYakAppDefinition } from './yield-yak.definition';

@Module({
  providers: [
    YieldYakAppDefinition,
    YieldYakContractFactory,
    AvalancheYieldyakVaultTokenFetcher,
    AvalancheYieldyakFarmContractPositionFetcher,
  ],
  exports: [YieldYakAppDefinition, YieldYakContractFactory],
})
export class YieldYakAppModule extends AbstractApp() {}
