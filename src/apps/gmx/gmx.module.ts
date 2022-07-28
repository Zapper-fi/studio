import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGmxBalanceFetcher } from './arbitrum/gmx.balance-fetcher';
import { ArbitrumGmxEsGmxTokenFetcher } from './arbitrum/gmx.es-gmx.token-fetcher';
import { ArbitrumGmxFarmContractPositionFetcher } from './arbitrum/gmx.farm.contract-position-fetcher';
import { ArbitrumGmxGlpTokenFetcher } from './arbitrum/gmx.glp.token-fetcher';
import { AvalancheGmxBalanceFetcher } from './avalanche/gmx.balance-fetcher';
import { AvalancheGmxEsGmxTokenFetcher } from './avalanche/gmx.es-gmx.token-fetcher';
import { AvalancheGmxFarmContractPositionFetcher } from './avalanche/gmx.farm.contract-position-fetcher';
import { AvalancheGmxGlpTokenFetcher } from './avalanche/gmx.glp.token-fetcher';
import { GmxContractFactory } from './contracts';
import GMX_DEFINITION, { GmxAppDefinition } from './gmx.definition';
import { GmxEsGmxTokenHelper } from './helpers/gmx.es-gmx.token-helper';
import { GmxGlpTokenHelper } from './helpers/gmx.glp.token-helper';

@Register.AppModule({
  appId: GMX_DEFINITION.id,
  providers: [
    GmxAppDefinition,
    GmxContractFactory,
    GmxEsGmxTokenHelper,
    GmxGlpTokenHelper,
    // Arbitrum
    ArbitrumGmxBalanceFetcher,
    ArbitrumGmxEsGmxTokenFetcher,
    ArbitrumGmxFarmContractPositionFetcher,
    ArbitrumGmxGlpTokenFetcher,
    // Avalanche
    AvalancheGmxBalanceFetcher,
    AvalancheGmxEsGmxTokenFetcher,
    AvalancheGmxFarmContractPositionFetcher,
    AvalancheGmxGlpTokenFetcher,
  ],
})
export class GmxAppModule extends AbstractApp() {}
