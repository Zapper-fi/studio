import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSiloFinanceIncentivesContractPositionfetcher } from './arbitrum/silo-finance.incentives.contract-position-fetcher';
import { SiloFinanceViemContractFactory } from './contracts';
import { EthereumSiloFinanceIncentivesContractPositionfetcher } from './ethereum/silo-finance.incentives.contract-position-fetcher';

@Module({
  providers: [
    SiloFinanceContractFactory,
    // Arbitrum
    ArbitrumSiloFinanceIncentivesContractPositionfetcher,
    // Ethereum
    EthereumSiloFinanceIncentivesContractPositionfetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
