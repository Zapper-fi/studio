import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory, AaveV2HealthFactorMetaHelper, AaveV2LendingBalanceHelper } from '~apps/aave-v2';

import { GeistContractFactory } from './contracts';
import { FantomGeistBalanceFetcher } from './fantom/geist.balance-fetcher';
import { FantomGeistIncentivesPositionFetcher } from './fantom/geist.incentives.contract-position-fetcher';
import { FantomGeistPlatformFeesPositionFetcher } from './fantom/geist.platform-fees.contract-position-fetcher';
import { FantomGeistPositionPresenter } from './fantom/geist.position-presentation';
import { FantomGeistStableDebtTokenFetcher } from './fantom/geist.stable-debt.token-fetcher';
import { FantomGeistSupplyTokenFetcher } from './fantom/geist.supply.token-fetcher';
import { FantomGeistVariableDebtTokenFetcher } from './fantom/geist.variable-debt.token-fetcher';
import { GeistAppDefinition, GEIST_DEFINITION } from './geist.definition';
import { GeistIncentivesBalanceHelper } from './helpers/geist.incentives.balance-helper';
import { GeistPlatformFeesBalanceHelper } from './helpers/geist.platform-fees.balance-helper';

@Register.AppModule({
  appId: GEIST_DEFINITION.id,
  providers: [
    AaveV2ContractFactory,
    AaveV2LendingBalanceHelper,
    AaveV2HealthFactorMetaHelper,
    FantomGeistBalanceFetcher,
    FantomGeistIncentivesPositionFetcher,
    FantomGeistPlatformFeesPositionFetcher,
    FantomGeistPositionPresenter,
    FantomGeistStableDebtTokenFetcher,
    FantomGeistSupplyTokenFetcher,
    FantomGeistVariableDebtTokenFetcher,
    GeistAppDefinition,
    GeistContractFactory,
    GeistIncentivesBalanceHelper,
    GeistPlatformFeesBalanceHelper,
  ],
})
export class GeistAppModule extends AbstractApp() {}
