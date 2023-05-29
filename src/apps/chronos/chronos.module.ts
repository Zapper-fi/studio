import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumChronosPoolTokenFetcher } from './arbitrum/chronos.pool.token-fetcher';
import { ChronosContractFactory } from './contracts';

@Module({
  providers: [UniswapV2ContractFactory, ChronosContractFactory, ArbitrumChronosPoolTokenFetcher],
})
export class ChronosAppModule extends AbstractApp() {}
