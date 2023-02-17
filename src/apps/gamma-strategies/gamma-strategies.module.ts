import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGammaStrategiesPoolTokenFetcher } from './arbitrum/gamma-strategies.pool.token-fetcher';
import { CeloGammaStrategiesPoolTokenFetcher } from './celo/gamma-strategies.pool.token-fetcher';
import { GammaStrategiesDefinitionResolver } from './common/gamma-strategies.definition-resolver';
import { GammaStrategiesContractFactory } from './contracts';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { EthereumGammaStrategiesTGammaTokenFetcher } from './ethereum/gamma-strategies.t-gamma.token-fetcher';
import { EthereumGammaStrategiesXGammaTokenFetcher } from './ethereum/gamma-strategies.x-gamma.token-fetcher';
import { OptimismGammaStrategiesPoolTokenFetcher } from './optimism/gamma-strategies.pool.token-fetcher';
import { PolygonGammaStrategiesPoolTokenFetcher } from './polygon/gamma-strategies.pool.token-fetcher';

@Module({
  providers: [
    GammaStrategiesContractFactory,
    GammaStrategiesDefinitionResolver,
    // Arbitrum
    ArbitrumGammaStrategiesPoolTokenFetcher,
    // Celo
    CeloGammaStrategiesPoolTokenFetcher,
    // Ethereum
    EthereumGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesTGammaTokenFetcher,
    EthereumGammaStrategiesXGammaTokenFetcher,
    // Optimism
    OptimismGammaStrategiesPoolTokenFetcher,
    // Polygon
    PolygonGammaStrategiesPoolTokenFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() {}
