import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUmamiFinanceMarinateContractPositionFetcher } from './arbitrum/umami-finance.marinate.contract-position-fetcher';
import { UmamiFinanceViemContractFactory } from './contracts';

@Module({
  providers: [ArbitrumUmamiFinanceMarinateContractPositionFetcher, UmamiFinanceViemContractFactory],
})
export class UmamiFinanceAppModule extends AbstractApp() {}
