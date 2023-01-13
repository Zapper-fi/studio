import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHedgefarmAlphaOneTokenFetcher } from './avalanche/hedgefarm.alpha-one.token-fetcher';
import { HedgefarmContractFactory } from './contracts';
import { HedgefarmAppDefinition } from './hedgefarm.definition';

@Module({
  providers: [AvalancheHedgefarmAlphaOneTokenFetcher, HedgefarmContractFactory],
})
export class HedgefarmAppModule extends AbstractApp() {}
