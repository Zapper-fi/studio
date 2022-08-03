import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2AppModule } from '~apps/aave-v2/aave-v2.module';

import { AvalancheBlizzBalanceFetcher } from './avalanche/blizz.balance-fetcher';
import { AvalancheBlizzStableDebtTokenFetcher } from './avalanche/blizz.stable-debt.token-fetcher';
import { AvalancheBlizzSupplyTokenFetcher } from './avalanche/blizz.supply.token-fetcher';
import { AvalancheBlizzVariableDebtTokenFetcher } from './avalanche/blizz.variable-debt.token-fetcher';
import { BlizzAppDefinition, BLIZZ_DEFINITION } from './blizz.definition';
import { BlizzContractFactory } from './contracts';
import { BlizzPlatformFeesBalanceHelper } from './helpers/blizz.platform-fees.balance-helper';

@Register.AppModule({
  appId: BLIZZ_DEFINITION.id,
  imports: [AaveV2AppModule],
  providers: [
    BlizzAppDefinition,
    BlizzContractFactory,
    BlizzPlatformFeesBalanceHelper,
    AvalancheBlizzBalanceFetcher,
    AvalancheBlizzStableDebtTokenFetcher,
    AvalancheBlizzSupplyTokenFetcher,
    AvalancheBlizzVariableDebtTokenFetcher,
  ],
})
export class BlizzAppModule extends AbstractApp() {}
