import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2AppModule } from '~apps/aave-v2';

import { GranaryFinanceContractFactory } from './contracts';
import { EthereumGranaryFinancePositionPresenter } from './ethereum/granary-finance.position-presenter';
import { EthereumGranaryFinanceStableDebtTokenFetcher } from './ethereum/granary-finance.stable-debt.token-fetcher';
import { EthereumGranaryFinanceSupplyTokenFetcher } from './ethereum/granary-finance.supply.token-fetcher';
import { EthereumGranaryFinanceVariableDebtTokenFetcher } from './ethereum/granary-finance.variable-debt.token-fetcher';
import { GranaryFinanceAppDefinition, GRANARY_FINANCE_DEFINITION } from './granary-finance.definition';
import { OptimismGranaryFinancePositionPresenter } from './optimism/granary-finance.position-presenter';
import { OptimismGranaryFinanceStableDebtTokenFetcher } from './optimism/granary-finance.stable-debt.token-fetcher';
import { OptimismGranaryFinanceSupplyTokenFetcher } from './optimism/granary-finance.supply.token-fetcher';
import { OptimismGranaryFinanceVariableDebtTokenFetcher } from './optimism/granary-finance.variable-debt.token-fetcher';

@Register.AppModule({
  appId: GRANARY_FINANCE_DEFINITION.id,
  imports: [AaveV2AppModule],
  providers: [
    EthereumGranaryFinancePositionPresenter,
    EthereumGranaryFinanceStableDebtTokenFetcher,
    EthereumGranaryFinanceSupplyTokenFetcher,
    EthereumGranaryFinanceVariableDebtTokenFetcher,
    OptimismGranaryFinancePositionPresenter,
    OptimismGranaryFinanceStableDebtTokenFetcher,
    OptimismGranaryFinanceSupplyTokenFetcher,
    OptimismGranaryFinanceVariableDebtTokenFetcher,
    GranaryFinanceAppDefinition,
    GranaryFinanceContractFactory,
  ],
})
export class GranaryFinanceAppModule extends AbstractApp() {}
