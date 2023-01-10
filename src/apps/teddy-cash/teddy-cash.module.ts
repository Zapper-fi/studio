import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import { AvalancheTeddyCashStabilityPoolContractPositionFetcher } from './avalanche/teddy-cash.stability-pool.contract-position-fetcher';
import { AvalancheTeddyCashTroveContractPositionFetcher } from './avalanche/teddy-cash.trove.contract-position-fetcher';
import { TeddyCashContractFactory } from './contracts';
import { TeddyCashAppDefinition } from './teddy-cash.definition';

@Module({
  providers: [
    TeddyCashAppDefinition,
    TeddyCashContractFactory,
    AvalancheTeddyCashFarmContractPositionFetcher,
    AvalancheTeddyCashStabilityPoolContractPositionFetcher,
    AvalancheTeddyCashTroveContractPositionFetcher,
  ],
})
export class TeddyCashAppModule extends AbstractApp() {}
