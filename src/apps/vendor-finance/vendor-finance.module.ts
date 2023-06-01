import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVendorFinancePoolContractPositionFetcher } from './arbitrum/vendor-finance.pool.contract-position-fetcher';
import { ArbitrumVendorFinancePoolV2ContractPositionFetcher } from './arbitrum/vendor-finance.pool-v2.contract-position-fetcher';
import { VendorFinanceContractFactory } from './contracts';
import { EthereumVendorFinancePoolContractPositionFetcher } from './ethereum/vendor-finance.pool.contract-position-fetcher';

@Module({
  providers: [
    VendorFinanceContractFactory,
    // Arbitrum
    ArbitrumVendorFinancePoolContractPositionFetcher,
    ArbitrumVendorFinancePoolV2ContractPositionFetcher,
    // Ethereum
    EthereumVendorFinancePoolContractPositionFetcher,
  ],
})
export class VendorFinanceAppModule extends AbstractApp() {}
