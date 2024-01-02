import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGmxFarmContractPositionFetcher } from './arbitrum/gmx.farm.contract-position-fetcher';
import { ArbitrumGmxGlpTokenFetcher } from './arbitrum/gmx.glp.token-fetcher';
import { ArbitrumGmxPerpContractPositionFetcher } from './arbitrum/gmx.perp.contract-position-fetcher';
import { AvalancheGmxFarmContractPositionFetcher } from './avalanche/gmx.farm.contract-position-fetcher';
import { AvalancheGmxGlpTokenFetcher } from './avalanche/gmx.glp.token-fetcher';
import { AvalancheGmxPerpContractPositionFetcher } from './avalanche/gmx.perp.contract-position-fetcher';
import { GmxViemContractFactory } from './contracts';

@Module({
  providers: [
    GmxViemContractFactory,
    // Arbitrum
    ArbitrumGmxFarmContractPositionFetcher,
    ArbitrumGmxGlpTokenFetcher,
    ArbitrumGmxPerpContractPositionFetcher,
    // Avalanche
    AvalancheGmxFarmContractPositionFetcher,
    AvalancheGmxGlpTokenFetcher,
    AvalancheGmxPerpContractPositionFetcher,
  ],
})
export class GmxAppModule extends AbstractApp() {}
