import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheVectorFinanceFarmContractPositionFetcher } from './avalanche/vector-finance.farm.contract-position-fetcher';
import { VectorFinanceViemContractFactory } from './contracts';

@Module({
  providers: [VectorFinanceViemContractFactory, AvalancheVectorFinanceFarmContractPositionFetcher],
})
export class VectorFinanceAppModule extends AbstractApp() {}
