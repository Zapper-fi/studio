import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMeanFinanceDcaPositionContractPositionFetcher } from './arbitrum/mean-finance.dca-position.contract-position-fetcher';
import { MeanFinanceContractFactory } from './contracts';
import { MeanFinanceAppDefinition, MEAN_FINANCE_DEFINITION } from './mean-finance.definition';
import { OptimismMeanFinanceDcaPositionContractPositionFetcher } from './optimism/mean-finance.dca-position.contract-position-fetcher';
import { PolygonMeanFinanceDcaPositionContractPositionFetcher } from './polygon/mean-finance.dca-position.contract-position-fetcher';
import { EthereumMeanFinanceDcaPositionContractPositionFetcher } from './ethereum/mean-finance.dca-position.contract-position-fetcher';

@Register.AppModule({
  appId: MEAN_FINANCE_DEFINITION.id,
  providers: [
    MeanFinanceAppDefinition,
    MeanFinanceContractFactory,
    OptimismMeanFinanceDcaPositionContractPositionFetcher,
    PolygonMeanFinanceDcaPositionContractPositionFetcher,
    ArbitrumMeanFinanceDcaPositionContractPositionFetcher,
    EthereumMeanFinanceDcaPositionContractPositionFetcher,
  ],
})
export class MeanFinanceAppModule extends AbstractApp() { }
