import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVendorFinancePoolContractPositionFetcher } from './arbitrum/vendor-finance.pool.contract-position-fetcher';
import { VendorFinanceContractFactory } from './contracts';
import { EthereumVendorFinancePoolContractPositionFetcher } from './ethereum/vendor-finance.pool.contract-position-fetcher';

@Module({
  providers: [
    ArbitrumVendorFinancePoolContractPositionFetcher,
    VendorFinanceContractFactory,
    EthereumVendorFinancePoolContractPositionFetcher,
  ],
})
export class VendorFinanceAppModule extends AbstractApp() {}
