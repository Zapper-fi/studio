import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { CronusFinanceContractFactory } from './contracts';
import { CronusFinanceAppDefinition, CRONUS_FINANCE_DEFINITION } from './cronus-finance.definition';
import { EvmosCronusFinanceBalanceFetcher } from './evmos/cronus-finance.balance-fetcher';
import { EvmosCronusFinanceFarmContractPositionFetcher } from './evmos/cronus-finance.farm.contract-position-fetcher';
import { EvmosCronusFinancePoolTokenFetcher } from './evmos/cronus-finance.pool.token-fetcher';

@Register.AppModule({
  appId: CRONUS_FINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    CronusFinanceAppDefinition,
    CronusFinanceContractFactory,
    EvmosCronusFinanceFarmContractPositionFetcher,
    EvmosCronusFinanceBalanceFetcher,
    EvmosCronusFinancePoolTokenFetcher,
  ],
})
export class CronusFinanceAppModule extends AbstractApp() {}
