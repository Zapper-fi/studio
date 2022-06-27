import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MeanFinanceContractFactory } from './contracts';
import { MeanFinanceAppDefinition, MEAN_FINANCE_DEFINITION } from './mean-finance.definition';
import { OptimismMeanFinanceBalanceFetcher } from './optimism/mean-finance.balance-fetcher';
import { OptimismMeanFinanceDcaPositionContractPositionFetcher } from './optimism/mean-finance.dca-position.contract-position-fetcher';
import { OptimismMeanFinanceTvlFetcher } from './optimism/mean-finance.tvl-fetcher';
import { PolygonMeanFinanceBalanceFetcher } from './polygon/mean-finance.balance-fetcher';
import { PolygonMeanFinanceDcaPositionContractPositionFetcher } from './polygon/mean-finance.dca-position.contract-position-fetcher';
import { PolygonMeanFinanceTvlFetcher } from './polygon/mean-finance.tvl-fetcher';

@Register.AppModule({
  appId: MEAN_FINANCE_DEFINITION.id,
  providers: [
    MeanFinanceAppDefinition,
    MeanFinanceContractFactory,
    OptimismMeanFinanceBalanceFetcher,
    OptimismMeanFinanceDcaPositionContractPositionFetcher,
    OptimismMeanFinanceTvlFetcher,
    PolygonMeanFinanceBalanceFetcher,
    PolygonMeanFinanceDcaPositionContractPositionFetcher,
    PolygonMeanFinanceTvlFetcher,
  ],
})
export class MeanFinanceAppModule extends AbstractApp() {}
