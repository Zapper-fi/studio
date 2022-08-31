import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EnzymeFinanceContractFactory } from './contracts';
import ENZYME_FINANCE_DEFINITION, { EnzymeFinanceAppDefinition } from './enzyme-finance.definition';
import { EthereumEnzymeFinanceVaultTokenFetcher } from './ethereum/enzyme-finance.vault.token-fetcher';

@Register.AppModule({
  appId: ENZYME_FINANCE_DEFINITION.id,
  providers: [EnzymeFinanceAppDefinition, EnzymeFinanceContractFactory, EthereumEnzymeFinanceVaultTokenFetcher],
})
export class EnzymeFinanceAppModule extends AbstractApp() {}
