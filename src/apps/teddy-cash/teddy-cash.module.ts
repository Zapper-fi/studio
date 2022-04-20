import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { LiquityAppModule } from '~apps/liquity/liquity.module';

import { AvalancheTeddyCashBalanceFetcher } from './avalanche/teddy-cash.balance-fetcher';
import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import { TeddyCashAppDefinition } from './teddy-cash.definition';

@Module({
  imports: [LiquityAppModule.externallyConfigured(LiquityAppModule, 0)],
  providers: [TeddyCashAppDefinition, AvalancheTeddyCashBalanceFetcher, AvalancheTeddyCashFarmContractPositionFetcher],
})
export class TeddyCashAppModule extends AbstractDynamicApp<TeddyCashAppModule>() {}
