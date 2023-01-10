import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVendorFinancePoolContractPositionFetcher } from './arbitrum/vendor-finance.pool.contract-position-fetcher';
import { VendorFinanceContractFactory } from './contracts';
import { VendorFinanceAppDefinition } from './vendor-finance.definition';

@Module({
  providers: [
    ArbitrumVendorFinancePoolContractPositionFetcher,
    VendorFinanceAppDefinition,
    VendorFinanceContractFactory,
  ],
})
export class VendorFinanceAppModule extends AbstractApp() {}
