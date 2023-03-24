import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumGammaStrategiesPoolTokenFetcher } from './arbitrum/gamma-strategies.pool.token-fetcher';
import { ArbitrumGammaZyberFarmContractPositionFetcher } from './arbitrum/gamma-strategies.zyberswap-chef.contract-position';
import { CeloGammaStrategiesPoolTokenFetcher } from './celo/gamma-strategies.pool.token-fetcher';
import { GammaStrategiesDefinitionResolver } from './common/gamma-strategies.definition-resolver';
import { GammaStrategiesContractFactory } from './contracts';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { EthereumGammaStrategiesTGammaTokenFetcher } from './ethereum/gamma-strategies.t-gamma.token-fetcher';
import { EthereumGammaStrategiesXGammaTokenFetcher } from './ethereum/gamma-strategies.x-gamma.token-fetcher';
import { OptimismGammaStrategiesPoolTokenFetcher } from './optimism/gamma-strategies.pool.token-fetcher';
import { OptimismGammaUniFarmContractPositionFetcher } from './optimism/gamma-strategies.op-uni-chef.contract-position';
import { PolygonGammaStrategiesPoolTokenFetcher } from './polygon/gamma-strategies.pool.token-fetcher';
import { PolygonGammaQuickSwapFarmContractPositionFetcher } from './polygon/gamma-strategies.quickswap-chef.contract-position';

@Module({
  providers: [
    GammaStrategiesContractFactory,
    GammaStrategiesDefinitionResolver,
    // Arbitrum
    ArbitrumGammaStrategiesPoolTokenFetcher,
    ArbitrumGammaZyberFarmContractPositionFetcher,
    // Celo
    CeloGammaStrategiesPoolTokenFetcher,
    // Ethereum
    EthereumGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesTGammaTokenFetcher,
    EthereumGammaStrategiesXGammaTokenFetcher,
    // Optimism
    OptimismGammaStrategiesPoolTokenFetcher,
    OptimismGammaUniFarmContractPositionFetcher,
    // Polygon
    PolygonGammaStrategiesPoolTokenFetcher,
    PolygonGammaQuickSwapFarmContractPositionFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() { }
