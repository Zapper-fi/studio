import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSushiswapKashiLendingTokenFetcher } from './arbitrum/sushiswap-kashi.lending.token-fetcher';
import { ArbitrumSushiswapKashiLeverageContractPositionFetcher } from './arbitrum/sushiswap-kashi.leverage.contract-position-fetcher';
import { BinanceSmartChainSushiswapKashiLendingTokenFetcher } from './binance-smart-chain/sushiswap-kashi.lending.token-fetcher';
import { BinanceSmartChainSushiswapKashiLeverageContractPositionFetcher } from './binance-smart-chain/sushiswap-kashi.leverage.contract-position-fetcher';
import { SushiswapKashiViemContractFactory } from './contracts';
import { EthereumSushiswapKashiLendingTokenFetcher } from './ethereum/sushiswap-kashi.lending.token-fetcher';
import { EthereumSushiswapKashiLeverageContractPositionFetcher } from './ethereum/sushiswap-kashi.leverage.contract-position-fetcher';
import { PolygonSushiswapKashiLendingTokenFetcher } from './polygon/sushiswap-kashi.lending.token-fetcher';
import { PolygonSushiswapKashiLeverageContractPositionFetcher } from './polygon/sushiswap-kashi.leverage.contract-position-fetcher';

@Module({
  providers: [
    SushiswapKashiViemContractFactory,
    // Arbitrum
    ArbitrumSushiswapKashiLendingTokenFetcher,
    ArbitrumSushiswapKashiLeverageContractPositionFetcher,
    // Binance Smart Chain
    BinanceSmartChainSushiswapKashiLendingTokenFetcher,
    BinanceSmartChainSushiswapKashiLeverageContractPositionFetcher,
    // Ethereum
    EthereumSushiswapKashiLendingTokenFetcher,
    EthereumSushiswapKashiLeverageContractPositionFetcher,
    // Polygon
    PolygonSushiswapKashiLendingTokenFetcher,
    PolygonSushiswapKashiLeverageContractPositionFetcher,
  ],
})
export class SushiSwapKashiAppModule extends AbstractApp() {}
