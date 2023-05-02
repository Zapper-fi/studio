import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLodestarFinancePoolTokenFetcher } from './arbitrum/lodestar-finance.pool.token-fetcher';
import { LodestarFinanceContractFactory } from './contracts';

@Module({
  providers: [ArbitrumLodestarFinancePoolTokenFetcher, LodestarFinanceContractFactory],
})
export class LodestarFinanceAppModule extends AbstractApp() {}
