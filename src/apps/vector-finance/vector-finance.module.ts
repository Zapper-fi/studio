import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VectorFinanceFarmContractPositionFetcher } from './avalanche/vector-finance.farm.contract-position-fetcher';
import { VectorFinanceViemContractFactory } from './contracts';

@Module({
  providers: [VectorFinanceViemContractFactory, VectorFinanceFarmContractPositionFetcher],
})
export class VectorFinanceAppModule extends AbstractApp() {}
