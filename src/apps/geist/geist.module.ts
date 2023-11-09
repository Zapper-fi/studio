import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { GeistViemContractFactory } from './contracts';
import { FantomGeistIncentivesPositionFetcher } from './fantom/geist.incentives.contract-position-fetcher';
import { FantomGeistPlatformFeesPositionFetcher } from './fantom/geist.platform-fees.contract-position-fetcher';
import { FantomGeistPositionPresenter } from './fantom/geist.position-presentation';
import { FantomGeistStableDebtTokenFetcher } from './fantom/geist.stable-debt.token-fetcher';
import { FantomGeistSupplyTokenFetcher } from './fantom/geist.supply.token-fetcher';
import { FantomGeistVariableDebtTokenFetcher } from './fantom/geist.variable-debt.token-fetcher';

@Module({
  providers: [
    GeistViemContractFactory,
    AaveV2ViemContractFactory,
    FantomGeistIncentivesPositionFetcher,
    FantomGeistPlatformFeesPositionFetcher,
    FantomGeistPositionPresenter,
    FantomGeistStableDebtTokenFetcher,
    FantomGeistSupplyTokenFetcher,
    FantomGeistVariableDebtTokenFetcher,
  ],
})
export class GeistAppModule extends AbstractApp() {}
