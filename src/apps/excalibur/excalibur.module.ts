import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumExcaliburPoolTokenFetcher } from './arbitrum/excalibur.pool.token-fetcher';

@Module({
  providers: [UniswapV2ViemContractFactory, ArbitrumExcaliburPoolTokenFetcher],
})
export class ExcaliburAppModule extends AbstractApp() {}
