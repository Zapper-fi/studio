import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { OptimismZipSwapPoolTokenFetcher } from './optimism/zip-swap.pool.token-fetcher';

@Module({
  providers: [UniswapV2ViemContractFactory, OptimismZipSwapPoolTokenFetcher],
})
export class ZipSwapAppModule extends AbstractApp() {}
