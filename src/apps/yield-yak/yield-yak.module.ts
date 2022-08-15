import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheYieldyakBalanceFetcher } from './avalanche/yieldyak.balance-fetcher';
import { AvalancheYieldyakFarmContractPositionFetcher } from './avalanche/yieldyak.farm.contract-position-fetcher';
import { AvalancheYieldyakVaultTokenFetcher } from './avalanche/yieldyak.vault.token-fetcher';
import { YieldYakContractFactory } from './contracts';
import { YieldYakVaultTokenDefinitionsResolver } from './helpers/yield-yak.vault.token-definitions-resolver';
import { YieldYakAppDefinition, YIELD_YAK_DEFINITION } from './yield-yak.definition';

@Register.AppModule({
  appId: YIELD_YAK_DEFINITION.id,
  providers: [
    YieldYakAppDefinition,
    YieldYakContractFactory,
    YieldYakVaultTokenDefinitionsResolver,
    AvalancheYieldyakVaultTokenFetcher,
    AvalancheYieldyakBalanceFetcher,
    AvalancheYieldyakFarmContractPositionFetcher,
  ],
  exports: [YieldYakAppDefinition, YieldYakContractFactory],
})
export class YieldYakAppModule extends AbstractApp() {}
