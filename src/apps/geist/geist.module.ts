import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { GeistContractFactory } from './contracts';
import { FantomGeistIncentivesPositionFetcher } from './fantom/geist.incentives.contract-position-fetcher';
import { FantomGeistPlatformFeesPositionFetcher } from './fantom/geist.platform-fees.contract-position-fetcher';
import { FantomGeistPositionPresenter } from './fantom/geist.position-presentation';
import { FantomGeistStableDebtTokenFetcher } from './fantom/geist.stable-debt.token-fetcher';
import { FantomGeistSupplyTokenFetcher } from './fantom/geist.supply.token-fetcher';
import { FantomGeistVariableDebtTokenFetcher } from './fantom/geist.variable-debt.token-fetcher';
import { GeistAppDefinition, GEIST_DEFINITION } from './geist.definition';

@Register.AppModule({
  appId: GEIST_DEFINITION.id,
  providers: [
    GeistAppDefinition,
    GeistContractFactory,
    AaveV2ContractFactory,
    FantomGeistIncentivesPositionFetcher,
    FantomGeistPlatformFeesPositionFetcher,
    FantomGeistPositionPresenter,
    FantomGeistStableDebtTokenFetcher,
    FantomGeistSupplyTokenFetcher,
    FantomGeistVariableDebtTokenFetcher,
  ],
})
export class GeistAppModule extends AbstractApp() {}
