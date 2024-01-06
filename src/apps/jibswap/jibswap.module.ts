import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { JBCJibswapPoolTokenFetcher } from './jbc/jibswap.pool.token-fetcher';


@Module({
  providers: [UniswapV2ViemContractFactory, JBCJibswapPoolTokenFetcher],
})
export class JibswapAppModule extends AbstractApp() {}
