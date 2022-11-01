import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MeanFinanceContractFactory } from './contracts';
import { MeanFinanceAppDefinition, MEAN_FINANCE_DEFINITION } from './mean-finance.definition';
import { OptimismMeanFinanceBalanceFetcher } from './optimism/mean-finance.balance-fetcher';
import { OptimismMeanFinanceDcaPositionContractPositionFetcher } from './optimism/mean-finance.dca-position.contract-position-fetcher';
import { PolygonMeanFinanceBalanceFetcher } from './polygon/mean-finance.balance-fetcher';
import { PolygonMeanFinanceDcaPositionContractPositionFetcher } from './polygon/mean-finance.dca-position.contract-position-fetcher';
import { ArbitrumMeanFinanceBalanceFetcher } from './arbitrum/mean-finance.balance-fetcher';
import { ArbitrumMeanFinanceDcaPositionContractPositionFetcher } from './arbitrum/mean-finance.dca-position.contract-position-fetcher';

@Register.AppModule({
  appId: MEAN_FINANCE_DEFINITION.id,
  providers: [
    MeanFinanceAppDefinition,
    MeanFinanceContractFactory,
    OptimismMeanFinanceBalanceFetcher,
    OptimismMeanFinanceDcaPositionContractPositionFetcher,
    PolygonMeanFinanceBalanceFetcher,
    PolygonMeanFinanceDcaPositionContractPositionFetcher,
    ArbitrumMeanFinanceBalanceFetcher,
    ArbitrumMeanFinanceDcaPositionContractPositionFetcher,
  ],
})
export class MeanFinanceAppModule extends AbstractApp() { }
