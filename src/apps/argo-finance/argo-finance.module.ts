import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArgoFinanceAppDefinition, ARGO_FINANCE_DEFINITION } from './argo-finance.definition';
import { ArgoFinanceContractFactory } from './contracts';
import { CronosArgoFinanceBalanceFetcher } from './cronos/argo-finance.balance-fetcher';
import { CronosArgoFinancePledgingContractPositionFetcher } from './cronos/argo-finance.pledging.contract-position-fetcher';
import { CronosArgoFinanceXArgoTokenFetcher } from './cronos/argo-finance.x-argo.token-fetcher';

@Register.AppModule({
  appId: ARGO_FINANCE_DEFINITION.id,
  providers: [
    ArgoFinanceAppDefinition,
    ArgoFinanceContractFactory,
    CronosArgoFinanceBalanceFetcher,
    CronosArgoFinancePledgingContractPositionFetcher,
    CronosArgoFinanceXArgoTokenFetcher,
  ],
})
export class ArgoFinanceAppModule extends AbstractApp() {}
