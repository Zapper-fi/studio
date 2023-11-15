import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumKyberswapElasticFarmContractPositionFetcher } from './arbitrum/kyberswap-elastic.farm.contract-position-fetcher';
import { ArbitrumKyberswapElasticLiquidityContractPositionFetcher } from './arbitrum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { AvalancheKyberswapElasticFarmContractPositionFetcher } from './avalanche/kyberswap-elastic.farm.contract-position-fetcher';
import { AvalancheKyberswapElasticLiquidityContractPositionFetcher } from './avalanche/kyberswap-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberswapElasticFarmContractPositionFetcher } from './binance-smart-chain/kyberswap-elastic.farm.contract-position-fetcher';
import { BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyberswap-elastic.liquidity.contract-position-fetcher';
import { KyberswapElasticApyDataLoader } from './common/kyberswap-elastic.apy.data-loader';
import { KyberswapElasticFarmContractPositionBuilder } from './common/kyberswap-elastic.farm.contract-position-builder';
import { KyberswapElasticLiquidityContractPositionBuilder } from './common/kyberswap-elastic.liquidity.contract-position-builder';
import { KyberswapElasticViemContractFactory } from './contracts';
import { EthereumKyberswapElasticFarmContractPositionFetcher } from './ethereum/kyberswap-elastic.farm.contract-position-fetcher';
import { EthereumKyberswapElasticLiquidityContractPositionFetcher } from './ethereum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { FantomKyberswapElasticLiquidityContractPositionFetcher } from './fantom/kyberswap-elastic.liquidity.contract-position-fetcher';
import { OptimismKyberswapElasticFarmContractPositionFetcher } from './optimism/kyberswap-elastic.farm.contract-position-fetcher';
import { OptimismKyberswapElasticLiquidityContractPositionFetcher } from './optimism/kyberswap-elastic.liquidity.contract-position-fetcher';
import { PolygonKyberswapElasticFarmContractPositionFetcher } from './polygon/kyberswap-elastic.farm.contract-position-fetcher';
import { PolygonKyberswapElasticLiquidityContractPositionFetcher } from './polygon/kyberswap-elastic.liquidity.contract-position-fetcher';

@Module({
  providers: [
    KyberswapElasticViemContractFactory,
    KyberswapElasticApyDataLoader,
    KyberswapElasticFarmContractPositionBuilder,
    KyberswapElasticLiquidityContractPositionBuilder,
    // Arbitrum
    ArbitrumKyberswapElasticLiquidityContractPositionFetcher,
    ArbitrumKyberswapElasticFarmContractPositionFetcher,
    // Avalanche
    AvalancheKyberswapElasticLiquidityContractPositionFetcher,
    AvalancheKyberswapElasticFarmContractPositionFetcher,
    // Binance-smart-chain
    BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher,
    BinanceSmartChainKyberswapElasticFarmContractPositionFetcher,
    // Ethereum
    EthereumKyberswapElasticLiquidityContractPositionFetcher,
    EthereumKyberswapElasticFarmContractPositionFetcher,
    // Fantom
    FantomKyberswapElasticLiquidityContractPositionFetcher,
    // Optimism
    OptimismKyberswapElasticLiquidityContractPositionFetcher,
    OptimismKyberswapElasticFarmContractPositionFetcher,
    // Polygon
    PolygonKyberswapElasticLiquidityContractPositionFetcher,
    PolygonKyberswapElasticFarmContractPositionFetcher,
  ],
})
export class KyberswapElasticAppModule extends AbstractApp() {}
