import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { OptimismZipSwapPoolTokenFetcher } from './optimism/zip-swap.pool.token-fetcher';
import { ZipSwapAppDefinition } from './zip-swap.definition';

@Module({
  providers: [UniswapV2ContractFactory, ZipSwapAppDefinition, OptimismZipSwapPoolTokenFetcher],
})
export class ZipSwapAppModule extends AbstractApp() {}
