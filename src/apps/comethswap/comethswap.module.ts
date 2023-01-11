import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ComethswapAppDefinition } from './comethswap.definition';
import { PolygonComethswapPoolTokenFetcher } from './polygon/comethswap.pool.token-fetcher';

@Module({
  providers: [ComethswapAppDefinition, UniswapV2ContractFactory, PolygonComethswapPoolTokenFetcher],
})
export class ComethswapAppModule extends AbstractApp() {}
