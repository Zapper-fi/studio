import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { AvalancheNereusFinancePositionPresenter } from './avalanche/nereus-finance.position-presenter';
import { AvalancheNereusFinanceStableDebtTokenFetcher } from './avalanche/nereus-finance.stable-debt.token-fetcher';
import { AvalancheNereusFinanceSupplyTokenFetcher } from './avalanche/nereus-finance.supply.token-fetcher';
import { AvalancheNereusFinanceVariableDebtTokenFetcher } from './avalanche/nereus-finance.variable-debt.token-fetcher';
import { NereusFinanceViemContractFactory } from './contracts';

@Module({
  providers: [
    NereusFinanceViemContractFactory,
    AaveV2ViemContractFactory,
    AvalancheNereusFinancePositionPresenter,
    AvalancheNereusFinanceStableDebtTokenFetcher,
    AvalancheNereusFinanceSupplyTokenFetcher,
    AvalancheNereusFinanceVariableDebtTokenFetcher,
  ],
})
export class NereusFinanceAppModule extends AbstractApp() {}
