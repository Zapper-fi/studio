import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSiloFinanceClaimableContractPositionFetcher } from './arbitrum/silo-finance.claimable.contract-position-fetcher';
import { SiloFinanceViemContractFactory } from './contracts';
import { EthereumSiloFinanceIncentivesContractPositionfetcher } from './ethereum/silo-finance.incentives.contract-position-fetcher';

@Module({
  providers: [
    SiloFinanceViemContractFactory,
    ArbitrumSiloFinanceClaimableContractPositionFetcher,
    EthereumSiloFinanceIncentivesContractPositionfetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
