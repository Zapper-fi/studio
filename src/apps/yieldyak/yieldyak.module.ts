import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheYieldyakBalanceFetcher } from './avalanche/yieldyak.balance-fetcher';
import { AvalancheYieldyakFarmsTokenFetcher } from './avalanche/yieldyak.farms.token-fetcher';
import { YieldyakContractFactory } from './contracts';
import { YieldyakAppDefinition, YIELDYAK_DEFINITION } from './yieldyak.definition';

@Register.AppModule({
  appId: YIELDYAK_DEFINITION.id,
  providers: [
    AvalancheYieldyakBalanceFetcher,
    AvalancheYieldyakFarmsTokenFetcher,
    YieldyakAppDefinition,
    YieldyakContractFactory,
  ],
})
export class YieldyakAppModule extends AbstractApp() {}
