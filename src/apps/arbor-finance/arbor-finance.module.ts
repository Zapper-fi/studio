import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArborFinanceAppDefinition, ARBOR_FINANCE_DEFINITION } from './arbor-finance.definition';
import { ArborFinanceContractFactory } from './contracts';
import { EthereumArborFinanceBondTokenFetcher } from './ethereum/arbor-finance.bond.token-fetcher';

@Register.AppModule({
  appId: ARBOR_FINANCE_DEFINITION.id,
  providers: [ArborFinanceAppDefinition, ArborFinanceContractFactory, EthereumArborFinanceBondTokenFetcher],
})
export class ArborFinanceAppModule extends AbstractApp() {}
