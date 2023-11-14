import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGmxEsGmxTokenFetcher } from './arbitrum/gmx.es-gmx.token-fetcher';
import { ArbitrumGmxFarmContractPositionFetcher } from './arbitrum/gmx.farm.contract-position-fetcher';
import { ArbitrumGmxGlpTokenFetcher } from './arbitrum/gmx.glp.token-fetcher';
import { ArbitrumGmxPerpContractPositionFetcher } from './arbitrum/gmx.perp.contract-position-fetcher';
import { AvalancheGmxEsGmxTokenFetcher } from './avalanche/gmx.es-gmx.token-fetcher';
import { AvalancheGmxFarmContractPositionFetcher } from './avalanche/gmx.farm.contract-position-fetcher';
import { AvalancheGmxGlpTokenFetcher } from './avalanche/gmx.glp.token-fetcher';
import { AvalancheGmxPerpContractPositionFetcher } from './avalanche/gmx.perp.contract-position-fetcher';
import { GmxViemContractFactory } from './contracts';

@Module({
  providers: [
    GmxViemContractFactory,
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
