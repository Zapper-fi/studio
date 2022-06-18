import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUmamiBalanceFetcher } from './arbitrum/umami.balance-fetcher';
import { ArbitrumUmamiCompoundTokenFetcher } from './arbitrum/umami.compound.token-fetcher';
import { ArbitrumUmamiMarinateContractPositionFetcher } from './arbitrum/umami.marinate.contract-position-fetcher';
import { ArbitrumUmamiMarinateTokenFetcher } from './arbitrum/umami.marinate.token-fetcher';
import { UmamiContractFactory } from './contracts';
import { UmamiAppDefinition, UMAMI_DEFINITION } from './umami.definition';

@Register.AppModule({
  appId: UMAMI_DEFINITION.id,
  providers: [
    ArbitrumUmamiBalanceFetcher,
    ArbitrumUmamiCompoundTokenFetcher,
    ArbitrumUmamiMarinateContractPositionFetcher,
    ArbitrumUmamiMarinateTokenFetcher,
    UmamiAppDefinition,
    UmamiContractFactory,
  ],
})
export class UmamiAppModule extends AbstractApp() {}
