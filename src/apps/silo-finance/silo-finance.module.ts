import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSiloFinanceSiloContractPositionFetcher } from './arbitrum/silo-finance.silo.contract-position-fetcher';
import { SiloFinanceContractFactory } from './contracts';
import { EthereumSiloFinanceSiloContractPositionFetcher } from './ethereum/silo-finance.silo.contract-position-fetcher';

@Module({
  providers: [
    EthereumSiloFinanceSiloContractPositionFetcher,
    ArbitrumSiloFinanceSiloContractPositionFetcher,
    SiloFinanceContractFactory,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
