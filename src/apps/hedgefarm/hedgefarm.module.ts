import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHedgefarmAlphaOneTokenFetcher } from './avalanche/hedgefarm.alpha-one.token-fetcher';
import { AvalancheHedgefarmBalanceFetcher } from './avalanche/hedgefarm.balance-fetcher';
import { HedgefarmContractFactory } from './contracts';
import { HedgefarmAppDefinition, HEDGEFARM_DEFINITION } from './hedgefarm.definition';

@Register.AppModule({
  appId: HEDGEFARM_DEFINITION.id,
  providers: [
    AvalancheHedgefarmAlphaOneTokenFetcher,
    AvalancheHedgefarmBalanceFetcher,
    HedgefarmAppDefinition,
    HedgefarmContractFactory,
  ],
})
export class HedgefarmAppModule extends AbstractApp() {}
