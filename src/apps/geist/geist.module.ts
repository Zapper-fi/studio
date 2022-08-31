import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2AppModule } from '~apps/aave-v2/aave-v2.module';

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
  imports: [AaveV2AppModule],
  providers: [
    FantomGeistIncentivesPositionFetcher,
    FantomGeistPlatformFeesPositionFetcher,
    FantomGeistPositionPresenter,
    FantomGeistStableDebtTokenFetcher,
    FantomGeistSupplyTokenFetcher,
    FantomGeistVariableDebtTokenFetcher,
    GeistAppDefinition,
    GeistContractFactory,
  ],
})
export class GeistAppModule extends AbstractApp() {}
