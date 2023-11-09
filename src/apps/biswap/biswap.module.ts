import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { BinanceSmartChainBiswapContractPositionFetcher } from './binance-smart-chain/biswap.farm.contract-position-fetcher';
import { BinanceSmartChainBiswapPoolTokenFetcher } from './binance-smart-chain/biswap.pool.token-fetcher';
import { BiswapViemContractFactory } from './contracts';

@Module({
  providers: [
    UniswapV2ViemContractFactory,
    BiswapViemContractFactory,
    BinanceSmartChainBiswapPoolTokenFetcher,
    BinanceSmartChainBiswapContractPositionFetcher,
  ],
})
export class BiswapAppModule extends AbstractApp() {}
