import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SiloFinanceViemContractFactory } from './contracts';
import { EthereumSiloFinanceIncentivesContractPositionfetcher } from './ethereum/silo-finance.incentives.contract-position-fetcher';

@Module({
  providers: [
    SiloFinanceViemContractFactory,
    // Ethereum
    EthereumSiloFinanceIncentivesContractPositionfetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
