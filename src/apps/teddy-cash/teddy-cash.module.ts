import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { LiquityAppModule } from '~apps/liquity';

import { AvalancheTeddyCashBalanceFetcher } from './avalanche/teddy-cash.balance-fetcher';
import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import TEDDY_CASH_DEFINITION, { TeddyCashAppDefinition } from './teddy-cash.definition';

@Register.AppModule({
  appId: TEDDY_CASH_DEFINITION.id,
  imports: [LiquityAppModule],
  providers: [TeddyCashAppDefinition, AvalancheTeddyCashBalanceFetcher, AvalancheTeddyCashFarmContractPositionFetcher],
})
export class TeddyCashAppModule extends AbstractApp() {}
