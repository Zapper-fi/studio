import { Module } from '@nestjs/common';

import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { LiquityAppModule } from '~apps/liquity/liquity.module';

import { AvalancheTeddyCashBalanceFetcher } from './avalanche/teddy-cash.balance-fetcher';
import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import { TeddyCashAppDefinition } from './teddy-cash.definition';

@Module({
  imports: ExternalAppImport(LiquityAppModule),
  providers: [TeddyCashAppDefinition, AvalancheTeddyCashBalanceFetcher, AvalancheTeddyCashFarmContractPositionFetcher],
})
export class TeddyCashAppModule extends AbstractApp() {}
