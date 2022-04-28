import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheTeddyCashBalanceFetcher } from './avalanche/teddy-cash.balance-fetcher';
import { AvalancheTeddyCashFarmContractPositionFetcher } from './avalanche/teddy-cash.farm.contract-position-fetcher';
import { TeddyCashAppDefinition } from './teddy-cash.definition';

@Register.AppModule({
  providers: [TeddyCashAppDefinition, AvalancheTeddyCashBalanceFetcher, AvalancheTeddyCashFarmContractPositionFetcher],
})
export class TeddyCashAppModule extends AbstractApp() {}
