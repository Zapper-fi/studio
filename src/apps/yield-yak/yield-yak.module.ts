import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheYieldyakFarmContractPositionFetcher } from './avalanche/yield-yak.farm.contract-position-fetcher';
import { AvalancheYieldyakVaultTokenFetcher } from './avalanche/yield-yak.vault.token-fetcher';
import { YieldYakContractFactory } from './contracts';
import { YieldYakAppDefinition, YIELD_YAK_DEFINITION } from './yield-yak.definition';

@Register.AppModule({
  appId: YIELD_YAK_DEFINITION.id,
  providers: [
    YieldYakAppDefinition,
    YieldYakContractFactory,
    AvalancheYieldyakVaultTokenFetcher,
    AvalancheYieldyakFarmContractPositionFetcher,
  ],
  exports: [YieldYakAppDefinition, YieldYakContractFactory],
})
export class YieldYakAppModule extends AbstractApp() {}
