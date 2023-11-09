import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumChronosPoolTokenFetcher } from './arbitrum/chronos.pool.token-fetcher';
import { ChronosViemContractFactory } from './contracts';

@Module({
  providers: [UniswapV2ViemContractFactory, ChronosViemContractFactory, ArbitrumChronosPoolTokenFetcher],
})
export class ChronosAppModule extends AbstractApp() {}
