import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumKyberswapElasticFarmContractPositionFetcher } from './arbitrum/kyberswap-elastic.farm.contract-position-fetcher';
import { ArbitrumKyberswapElasticLiquidityContractPositionFetcher } from './arbitrum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { AvalancheKyberswapElasticFarmContractPositionFetcher } from './avalanche/kyberswap-elastic.farm.contract-position-fetcher';
import { AvalancheKyberswapElasticLiquidityContractPositionFetcher } from './avalanche/kyberswap-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyberswap-elastic.liquidity.contract-position-fetcher';
import { KyberswapElasticApyDataLoader } from './common/kyberswap-elastic.apy.data-loader';
import { KyberswapElasticFarmContractPositionBuilder } from './common/kyberswap-elastic.farm.contract-position-builder';
import { KyberswapElasticLiquidityContractPositionBuilder } from './common/kyberswap-elastic.liquidity.contract-position-builder';
import { KyberswapElasticContractFactory } from './contracts';
import { EthereumKyberswapElasticFarmContractPositionFetcher } from './ethereum/kyberswap-elastic.farm.contract-position-fetcher';
import { EthereumKyberswapElasticLiquidityContractPositionFetcher } from './ethereum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { FantomKyberswapElasticLiquidityContractPositionFetcher } from './fantom/kyberswap-elastic.liquidity.contract-position-fetcher';
import { OptimismKyberswapElasticFarmContractPositionFetcher } from './optimism/kyberswap-elastic.farm.contract-position-fetcher';
import { OptimismKyberswapElasticLiquidityContractPositionFetcher } from './optimism/kyberswap-elastic.liquidity.contract-position-fetcher';
import { PolygonKyberswapElasticFarmContractPositionFetcher } from './polygon/kyberswap-elastic.farm.contract-position-fetcher';
import { PolygonKyberswapElasticLiquidityContractPositionFetcher } from './polygon/kyberswap-elastic.liquidity.contract-position-fetcher';

@Module({
  providers: [
    KyberswapElasticContractFactory,
    KyberswapElasticApyDataLoader,
    KyberswapElasticFarmContractPositionBuilder,
    KyberswapElasticLiquidityContractPositionBuilder,
    // Ethereum
    EthereumKyberswapElasticLiquidityContractPositionFetcher,
    EthereumKyberswapElasticFarmContractPositionFetcher,
    // Binance-smart-chain
    BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher,
    // Avalanche
    AvalancheKyberswapElasticLiquidityContractPositionFetcher,
    AvalancheKyberswapElasticFarmContractPositionFetcher,
    // Fantom
    FantomKyberswapElasticLiquidityContractPositionFetcher,
    // Optimism
    OptimismKyberswapElasticLiquidityContractPositionFetcher,
    OptimismKyberswapElasticFarmContractPositionFetcher,
    // Arbitrum
    ArbitrumKyberswapElasticLiquidityContractPositionFetcher,
    ArbitrumKyberswapElasticFarmContractPositionFetcher,
    // Polygon
    PolygonKyberswapElasticLiquidityContractPositionFetcher,
    PolygonKyberswapElasticFarmContractPositionFetcher,
  ],
})
export class KyberswapElasticAppModule extends AbstractApp() {}
