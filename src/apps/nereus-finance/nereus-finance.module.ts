import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { AvalancheNereusFinancePositionPresenter } from './avalanche/nereus-finance.position-presenter';
import { AvalancheNereusFinanceStableDebtTokenFetcher } from './avalanche/nereus-finance.stable-debt.token-fetcher';
import { AvalancheNereusFinanceSupplyTokenFetcher } from './avalanche/nereus-finance.supply.token-fetcher';
import { AvalancheNereusFinanceVariableDebtTokenFetcher } from './avalanche/nereus-finance.variable-debt.token-fetcher';
import { NereusFinanceContractFactory } from './contracts';
import { NereusFinanceAppDefinition, NEREUS_FINANCE_DEFINITION } from './nereus-finance.definition';

@Register.AppModule({
  appId: NEREUS_FINANCE_DEFINITION.id,
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
