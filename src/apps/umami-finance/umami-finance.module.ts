import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUmamiFinanceCompoundTokenFetcher } from './arbitrum/umami-finance.compound.token-fetcher';
import { ArbitrumUmamiFinanceMarinateUmamiTokenFetcher } from './arbitrum/umami-finance.marinate-umami.token-fetcher';
import { ArbitrumUmamiFinanceMarinateContractPositionFetcher } from './arbitrum/umami-finance.marinate.contract-position-fetcher';
import { ArbitrumUmamiFinanceVaultsTokenFetcher } from './arbitrum/umami-finance.vaults.token-fetcher';
import { UmamiFinanceYieldResolver } from './common/umami-finance.marinate.token-definition-resolver';
import { UmamiFinanceContractFactory } from './contracts';
import { UmamiFinanceAppDefinition, UMAMI_FINANCE_DEFINITION } from './umami-finance.definition';

@Register.AppModule({
  appId: UMAMI_FINANCE_DEFINITION.id,
  providers: [
    UmamiFinanceAppDefinition,
    UmamiFinanceContractFactory,
    UmamiFinanceYieldResolver,
    // Arbitrum
    ArbitrumUmamiFinanceCompoundTokenFetcher,
    ArbitrumUmamiFinanceMarinateContractPositionFetcher,
    ArbitrumUmamiFinanceVaultsTokenFetcher,
    ArbitrumUmamiFinanceMarinateUmamiTokenFetcher,
  ],
})
export class UmamiFinanceAppModule extends AbstractApp() {}
