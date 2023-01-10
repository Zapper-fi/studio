import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UniswapV2ContractFactory } from './contracts';
import { EthereumUniswapV2PoolTokenFetcher } from './ethereum/uniswap-v2.pool.token-fetcher';
import { UniswapV2AppDefinition } from './uniswap-v2.definition';

@Module({
  providers: [UniswapV2AppDefinition, UniswapV2ContractFactory, EthereumUniswapV2PoolTokenFetcher],
})
export class UniswapV2AppModule extends AbstractApp() {}
