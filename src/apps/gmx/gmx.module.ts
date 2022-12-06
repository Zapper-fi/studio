import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGmxEsGmxTokenFetcher } from './arbitrum/gmx.es-gmx.token-fetcher';
import { ArbitrumGmxFarmContractPositionFetcher } from './arbitrum/gmx.farm.contract-position-fetcher';
import { ArbitrumGmxGlpTokenFetcher } from './arbitrum/gmx.glp.token-fetcher';
import { ArbitrumGmxPerpContractPositionFetcher } from './arbitrum/gmx.perp.contract-position-fetcher';
import { AvalancheGmxEsGmxTokenFetcher } from './avalanche/gmx.es-gmx.token-fetcher';
import { AvalancheGmxFarmContractPositionFetcher } from './avalanche/gmx.farm.contract-position-fetcher';
import { AvalancheGmxGlpTokenFetcher } from './avalanche/gmx.glp.token-fetcher';
import { AvalancheGmxPerpContractPositionFetcher } from './avalanche/gmx.perp.contract-position-fetcher';
import { GmxContractFactory } from './contracts';
import { GmxAppDefinition, GMX_DEFINITION } from './gmx.definition';

@Register.AppModule({
  appId: GMX_DEFINITION.id,
  providers: [
    GmxAppDefinition,
    GmxContractFactory,
    // Arbitrum
    ArbitrumGmxEsGmxTokenFetcher,
    ArbitrumGmxFarmContractPositionFetcher,
    ArbitrumGmxGlpTokenFetcher,
    ArbitrumGmxPerpContractPositionFetcher,
    // Avalanche
    AvalancheGmxEsGmxTokenFetcher,
    AvalancheGmxFarmContractPositionFetcher,
    AvalancheGmxGlpTokenFetcher,
    AvalancheGmxPerpContractPositionFetcher,
  ],
})
export class GmxAppModule extends AbstractApp() {}
