import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UniswapV2ViemContractFactory } from './contracts';
import { EthereumUniswapV2PoolTokenFetcher } from './ethereum/uniswap-v2.pool.token-fetcher';

@Module({
  providers: [UniswapV2ViemContractFactory, EthereumUniswapV2PoolTokenFetcher],
})
export class UniswapV2AppModule extends AbstractApp() {}
