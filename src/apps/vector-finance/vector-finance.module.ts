import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VectorFinanceFarmContractPositionFetcher } from './avalanche/vector-finance.farm.contract-position-fetcher';
import { VectorFinanceContractFactory } from './contracts';
import { VectorFinanceAppDefinition } from './vector-finance.definition';

@Module({
  providers: [VectorFinanceContractFactory, VectorFinanceFarmContractPositionFetcher],
})
export class VectorFinanceAppModule extends AbstractApp() {}
