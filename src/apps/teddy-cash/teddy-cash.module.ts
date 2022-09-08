import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { LiquityAppModule } from '~apps/liquity';

import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import { AvalancheTeddyCashStabilityPoolContractPositionFetcher } from './avalanche/teddy-cash.stability-pool.contract-position-fetcher';
import { AvalancheTeddyCashTroveContractPositionFetcher } from './avalanche/teddy-cash.trove.contract-position-fetcher';
import { TeddyCashContractFactory } from './contracts';
import TEDDY_CASH_DEFINITION, { TeddyCashAppDefinition } from './teddy-cash.definition';

@Register.AppModule({
  appId: TEDDY_CASH_DEFINITION.id,
  imports: [LiquityAppModule],
  providers: [
    TeddyCashAppDefinition,
    TeddyCashContractFactory,
    AvalancheTeddyCashFarmContractPositionFetcher,
    AvalancheTeddyCashStabilityPoolContractPositionFetcher,
    AvalancheTeddyCashTroveContractPositionFetcher,
  ],
})
export class TeddyCashAppModule extends AbstractApp() {}
