import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGammaStrategiesPoolTokenFetcher } from './arbitrum/gamma-strategies.pool.token-fetcher';
import { ArbitrumGammaStrategiesZyberFarmContractPositionFetcher } from './arbitrum/gamma-strategies.zyber-farm.contract-position-fetcher';
import { CeloGammaStrategiesPoolTokenFetcher } from './celo/gamma-strategies.pool.token-fetcher';
import { GammaStrategiesDefinitionResolver } from './common/gamma-strategies.definition-resolver';
import { GammaStrategiesViemContractFactory } from './contracts';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { OptimismGammaStrategiesPoolTokenFetcher } from './optimism/gamma-strategies.pool.token-fetcher';
import { OptimismGammaStrategiesUniFarmContractPositionFetcher } from './optimism/gamma-strategies.uni-farm.contract-position-fetcher';
import { PolygonGammaStrategiesPoolTokenFetcher } from './polygon/gamma-strategies.pool.token-fetcher';
import { PolygonGammaStrategiesQuickSwapFarmContractPositionFetcher } from './polygon/gamma-strategies.quickswap-farm.contract-position-fetcher';

@Module({
  providers: [
    ArbitrumGammaStrategiesPoolTokenFetcher,
    ArbitrumGammaStrategiesZyberFarmContractPositionFetcher,
    CeloGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesPoolTokenFetcher,
    GammaStrategiesViemContractFactory,
    GammaStrategiesDefinitionResolver,
    OptimismGammaStrategiesPoolTokenFetcher,
    OptimismGammaStrategiesUniFarmContractPositionFetcher,
    PolygonGammaStrategiesPoolTokenFetcher,
    PolygonGammaStrategiesQuickSwapFarmContractPositionFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() {}
