import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArborFinanceAppDefinition, ARBOR_FINANCE_DEFINITION } from './arbor-finance.definition';
import { ArborFinanceContractFactory } from './contracts';
import { EthereumArborFinanceArborFinanceTokenFetcher } from './ethereum/arbor-finance.arbor-finance.token-fetcher';
import { EthereumArborFinanceBalanceFetcher } from './ethereum/arbor-finance.balance-fetcher';

@Register.AppModule({
  appId: ARBOR_FINANCE_DEFINITION.id,
  providers: [
    ArborFinanceAppDefinition,
    ArborFinanceContractFactory,
    EthereumArborFinanceArborFinanceTokenFetcher,
    EthereumArborFinanceBalanceFetcher,
  ],
})
export class ArborFinanceAppModule extends AbstractApp() {}
