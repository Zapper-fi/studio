import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MeanFinanceContractFactory } from './contracts';
import { MeanFinanceAppDefinition, MEAN_FINANCE_DEFINITION } from './mean-finance.definition';
import { OptimismMeanFinanceBalanceFetcher } from './optimism/mean-finance.balance-fetcher';
import { PolygonMeanFinanceBalanceFetcher } from './polygon/mean-finance.balance-fetcher';

@Register.AppModule({
  appId: MEAN_FINANCE_DEFINITION.id,
  providers: [
    MeanFinanceAppDefinition,
    MeanFinanceContractFactory,
    OptimismMeanFinanceBalanceFetcher,
    PolygonMeanFinanceBalanceFetcher,
  ],
})
export class MeanFinanceAppModule extends AbstractApp() { }
