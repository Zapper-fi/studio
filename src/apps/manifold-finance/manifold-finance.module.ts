import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ManifoldFinanceContractFactory } from './contracts';
import { EthereumManifoldFinanceStakingTokenFetcher } from './ethereum/manifold-finance.staking.token-fetcher';
import { ManifoldFinanceAppDefinition, MANIFOLD_FINANCE_DEFINITION } from './manifold-finance.definition';

@Register.AppModule({
  appId: MANIFOLD_FINANCE_DEFINITION.id,
  providers: [EthereumManifoldFinanceStakingTokenFetcher, ManifoldFinanceAppDefinition, ManifoldFinanceContractFactory],
})
export class ManifoldFinanceAppModule extends AbstractApp() {}
