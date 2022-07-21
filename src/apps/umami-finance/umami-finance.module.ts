import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUmamiFinanceBalanceFetcher } from './arbitrum/umami-finance.balance-fetcher';
import { ArbitrumUmamiFinanceCompoundTokenFetcher } from './arbitrum/umami-finance.compound.token-fetcher';
import { ArbitrumUmamiFinanceMarinateContractPositionFetcher } from './arbitrum/umami-finance.marinate.contract-position-fetcher';
import { ArbitrumUmamiMarinateTokenFetcher } from './arbitrum/umami-finance.marinate.token-fetcher';
import { UmamiFinanceContractFactory } from './contracts';
import { UmamiFinanceAppDefinition, UMAMI_FINANCE_DEFINITION } from './umami-finance.definition';

@Register.AppModule({
  appId: UMAMI_FINANCE_DEFINITION.id,
  providers: [
    ArbitrumUmamiFinanceBalanceFetcher,
    ArbitrumUmamiFinanceCompoundTokenFetcher,
    ArbitrumUmamiFinanceMarinateContractPositionFetcher,
    ArbitrumUmamiMarinateTokenFetcher,
    UmamiFinanceAppDefinition,
    UmamiFinanceContractFactory,
  ],
})
export class UmamiFinanceAppModule extends AbstractApp() {}
