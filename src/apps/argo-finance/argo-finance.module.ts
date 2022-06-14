import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArgoFinanceAppDefinition, ARGO_FINANCE_DEFINITION } from './argo-finance.definition';
import { ArgoFinanceContractFactory } from './contracts';
import { CronosArgoFinancePledgingContractPositionFetcher } from './cronos/argo-finance.pledging.contract-position-fetcher';
import { CronosArgoFinancePledgingTokenFetcher } from './cronos/argo-finance.pledging.token-fetcher';

@Register.AppModule({
  appId: ARGO_FINANCE_DEFINITION.id,
  providers: [
    ArgoFinanceAppDefinition,
    ArgoFinanceContractFactory,
    CronosArgoFinancePledgingContractPositionFetcher,
    CronosArgoFinancePledgingTokenFetcher,
  ],
})
export class ArgoFinanceAppModule extends AbstractApp() {}
