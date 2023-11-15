import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainPancakeSwapV3LiquidityContractPositionFetcher } from './binance-smart-chain/pancakeswap-v3.liquidity.contract-position-fetcher';
import { PancakeswapV3LiquidityContractPositionBuilder } from './common/pancakeswap-v3.liquidity.contract-position-builder';
import { PancakeswapV3ViemContractFactory } from './contracts';

@Module({
  providers: [
    PancakeswapV3ViemContractFactory,
    BinanceSmartChainPancakeSwapV3LiquidityContractPositionFetcher,
    PancakeswapV3LiquidityContractPositionBuilder,
  ],
})
export class PancakeswapV3AppModule extends AbstractApp() {}
