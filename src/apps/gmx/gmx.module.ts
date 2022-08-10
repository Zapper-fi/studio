import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGmxBalanceFetcher } from './arbitrum/gmx.balance-fetcher';
import { ArbitrumGmxEsGmxTokenFetcher } from './arbitrum/gmx.es-gmx.token-fetcher';
import { ArbitrumGmxFarmContractPositionFetcher } from './arbitrum/gmx.farm.contract-position-fetcher';
import { ArbitrumGmxGlpTokenFetcher } from './arbitrum/gmx.glp.token-fetcher';
import { ArbitrumOptionsFarmContractPositionFetcher } from './arbitrum/gmx.option.contract-position-fetcher';
import { AvalancheGmxBalanceFetcher } from './avalanche/gmx.balance-fetcher';
import { AvalancheGmxEsGmxTokenFetcher } from './avalanche/gmx.es-gmx.token-fetcher';
import { AvalancheGmxFarmContractPositionFetcher } from './avalanche/gmx.farm.contract-position-fetcher';
import { AvalancheGmxGlpTokenFetcher } from './avalanche/gmx.glp.token-fetcher';
import { AvalancheOptionsFarmContractPositionFetcher } from './avalanche/gmx.option.contract-position-fetcher';
import { GmxContractFactory } from './contracts';
import GMX_DEFINITION, { GmxAppDefinition } from './gmx.definition';
import { GmxEsGmxTokenHelper } from './helpers/gmx.es-gmx.token-helper';
import { GmxGlpTokenHelper } from './helpers/gmx.glp.token-helper';
import { GmxOptionBalanceHelper } from './helpers/gmx.option.balance-helper';
import { GmxOptionContractPositionHelper } from './helpers/gmx.option.contract-position-helper';

@Register.AppModule({
  appId: GMX_DEFINITION.id,
  providers: [
    GmxAppDefinition,
    GmxContractFactory,
    GmxEsGmxTokenHelper,
    GmxGlpTokenHelper,
    GmxOptionContractPositionHelper,
    GmxOptionBalanceHelper,
    // Arbitrum
    ArbitrumGmxBalanceFetcher,
    ArbitrumGmxEsGmxTokenFetcher,
    ArbitrumGmxFarmContractPositionFetcher,
    ArbitrumGmxGlpTokenFetcher,
    ArbitrumOptionsFarmContractPositionFetcher,
    // Avalanche
    AvalancheGmxBalanceFetcher,
    AvalancheGmxEsGmxTokenFetcher,
    AvalancheGmxFarmContractPositionFetcher,
    AvalancheGmxGlpTokenFetcher,
    AvalancheOptionsFarmContractPositionFetcher,
  ],
})
export class GmxAppModule extends AbstractApp() {}
