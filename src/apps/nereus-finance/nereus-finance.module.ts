import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { AvalancheNereusFinancePositionPresenter } from './avalanche/nereus-finance.position-presenter';
import { AvalancheNereusFinanceStableDebtTokenFetcher } from './avalanche/nereus-finance.stable-debt.token-fetcher';
import { AvalancheNereusFinanceSupplyTokenFetcher } from './avalanche/nereus-finance.supply.token-fetcher';
import { AvalancheNereusFinanceVariableDebtTokenFetcher } from './avalanche/nereus-finance.variable-debt.token-fetcher';
import { NereusFinanceContractFactory } from './contracts';
import { NereusFinanceAppDefinition } from './nereus-finance.definition';

@Module({
  providers: [
    NereusFinanceAppDefinition,
    NereusFinanceContractFactory,
    AaveV2ContractFactory,
    AvalancheNereusFinancePositionPresenter,
    AvalancheNereusFinanceStableDebtTokenFetcher,
    AvalancheNereusFinanceSupplyTokenFetcher,
    AvalancheNereusFinanceVariableDebtTokenFetcher,
  ],
})
export class NereusFinanceAppModule extends AbstractApp() {}
