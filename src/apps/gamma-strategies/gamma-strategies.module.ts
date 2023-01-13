import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGammaStrategiesPoolTokenFetcher } from './arbitrum/gamma-strategies.pool.token-fetcher';
import { CeloGammaStrategiesPoolTokenFetcher } from './celo/gamma-strategies.pool.token-fetcher';
import { GammaStrategiesContractFactory } from './contracts';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { EthereumGammaStrategiesTGammaTokenFetcher } from './ethereum/gamma-strategies.t-gamma.token-fetcher';
import { EthereumGammaStrategiesXGammaTokenFetcher } from './ethereum/gamma-strategies.x-gamma.token-fetcher';
import { GammaApiHelper } from './helpers/gamma-strategies.api';
import { OptimismGammaStrategiesPoolTokenFetcher } from './optimism/gamma-strategies.pool.token-fetcher';
import { PolygonGammaStrategiesPoolTokenFetcher } from './polygon/gamma-strategies.pool.token-fetcher';

@Module({
  providers: [
    GammaApiHelper,
    ArbitrumGammaStrategiesPoolTokenFetcher,
    CeloGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesTGammaTokenFetcher,
    EthereumGammaStrategiesXGammaTokenFetcher,

    GammaStrategiesContractFactory,
    OptimismGammaStrategiesPoolTokenFetcher,
    PolygonGammaStrategiesPoolTokenFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() {}
