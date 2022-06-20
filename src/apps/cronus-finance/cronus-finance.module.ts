import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CronusFinanceContractFactory } from './contracts';
import { CronusFinanceAppDefinition, CRONUS_FINANCE_DEFINITION } from './cronus-finance.definition';
import { EvmosCronusFinanceBalanceFetcher } from './evmos/cronus-finance.balance-fetcher';
import { EvmosCronusFinanceFarmTokenFetcher } from './evmos/cronus-finance.farm.token-fetcher';
import { EvmosCronusFinanceJarTokenFetcher } from './evmos/cronus-finance.jar.token-fetcher';
import { EvmosCronusFinanceTvlFetcher } from './evmos/cronus-finance.tvl-fetcher';

@Register.AppModule({
  appId: CRONUS_FINANCE_DEFINITION.id,
  providers: [
    CronusFinanceAppDefinition,
    CronusFinanceContractFactory,
    EvmosCronusFinanceFarmTokenFetcher,
    EvmosCronusFinanceBalanceFetcher,
    EvmosCronusFinanceJarTokenFetcher,
    EvmosCronusFinanceTvlFetcher,
  ],
})
export class CronusFinanceAppModule extends AbstractApp() {}
