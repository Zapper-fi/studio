import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { PolygonComethswapPoolTokenFetcher } from './polygon/comethswap.pool.token-fetcher';

@Module({
  providers: [UniswapV2ContractFactory, PolygonComethswapPoolTokenFetcher],
})
export class ComethswapAppModule extends AbstractApp() {}
