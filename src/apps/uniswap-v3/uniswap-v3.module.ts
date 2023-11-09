import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUniswapV3LiquidityContractPositionFetcher } from './arbitrum/uniswap-v3.liquidity.contract-position-fetcher';
import { BaseUniswapV3LiquidityContractPositionBuilder } from './base/uniswap-v3.liquidity.contract-position-builder';
import { BaseUniswapV3LiquidityContractPositionFetcher } from './base/uniswap-v3.liquidity.contract-position-fetcher';
import { BinanceSmartChainUniswapV3LiquidityContractPositionFetcher } from './binance-smart-chain/uniswap-v3.liquidity.contract-position-fetcher';
import { CeloUniswapV3LiquidityContractPositionBuilder } from './celo/uniswap-v3.liquidity.contract-position-builder';
import { CeloUniswapV3LiquidityContractPositionFetcher } from './celo/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3LiquidityContractPositionBuilder } from './common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ViemContractFactory } from './contracts';
import { EthereumUniswapV3LiquidityContractPositionFetcher } from './ethereum/uniswap-v3.liquidity.contract-position-fetcher';
import { OptimismUniswapV3LiquidityContractPositionFetcher } from './optimism/uniswap-v3.liquidity.contract-position-fetcher';
import { PolygonUniswapV3LiquidityContractPositionFetcher } from './polygon/uniswap-v3.liquidity.contract-position-fetcher';

@Module({
  providers: [
    UniswapV3ViemContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    // Arbitrum
    ArbitrumUniswapV3LiquidityContractPositionFetcher,
    // Base
    BaseUniswapV3LiquidityContractPositionBuilder,
    BaseUniswapV3LiquidityContractPositionFetcher,
    // Binance-smart-chain
    BinanceSmartChainUniswapV3LiquidityContractPositionFetcher,
    // Celo
    CeloUniswapV3LiquidityContractPositionFetcher,
    CeloUniswapV3LiquidityContractPositionBuilder,
    // Ethereum
    EthereumUniswapV3LiquidityContractPositionFetcher,
    // Optimism
    OptimismUniswapV3LiquidityContractPositionFetcher,
    // Polygon
    PolygonUniswapV3LiquidityContractPositionFetcher,
  ],
})
export class UniswapV3AppModule extends AbstractApp() {}
