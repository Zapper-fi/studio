import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { CronusFinanceContractFactory } from './contracts';
import { CronusFinanceAppDefinition, CRONUS_FINANCE_DEFINITION } from './cronus-finance.definition';
import { EvmosCronusFinanceBalanceFetcher } from './evmos/cronus-finance.balance-fetcher';
import { EvmosCronusFinanceFarmTokenFetcher } from './evmos/cronus-finance.farm.token-fetcher';
import { EvmosCronusFinancePoolTokenFetcher } from './evmos/cronus-finance.pool.token-fetcher';
import { EvmosCronusFinanceTvlFetcher } from './evmos/cronus-finance.tvl-fetcher';

@Register.AppModule({
  appId: CRONUS_FINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    CronusFinanceAppDefinition,
    CronusFinanceContractFactory,
    EvmosCronusFinanceFarmTokenFetcher,
    EvmosCronusFinanceBalanceFetcher,
    EvmosCronusFinancePoolTokenFetcher,
    EvmosCronusFinanceTvlFetcher,
  ],
})
export class CronusFinanceAppModule extends AbstractApp() {}
