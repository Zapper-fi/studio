import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { BinanceSmartChainBiswapContractPositionFetcher } from './binance-smart-chain/biswap.farm.contract-position-fetcher';
import { BinanceSmartChainBiswapPoolTokenFetcher } from './binance-smart-chain/biswap.pool.token-fetcher';
import { BiswapContractFactory } from './contracts';

@Module({
  providers: [
    UniswapV2ContractFactory,
    BiswapContractFactory,
    BinanceSmartChainBiswapPoolTokenFetcher,
    BinanceSmartChainBiswapContractPositionFetcher,
  ],
})
export class BiswapAppModule extends AbstractApp() {}
