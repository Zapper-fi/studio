import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumY2KFinanceFarmV1ContractPositionFetcher } from './arbitrum/y2k-finance.farm-v1.contract-position-fetcher';
import { ArbitrumY2KFinanceMintV1ContractPositionFetcher } from './arbitrum/y2k-finance.mint-v1.contract-position-fetcher';
import { ArbitrumY2KFinanceMintV2ContractPositionFetcher } from './arbitrum/y2k-finance.mint-v2.contract-position-fetcher';
import { ArbitrumY2KFinanceVotingLockedContractPositionFetcher } from './arbitrum/y2k-finance.voting-locked.contract-position-fetcher';
import { Y2KFinanceViemContractFactory } from './contracts';

@Module({
  providers: [
    Y2KFinanceViemContractFactory,
    // Arbitrum
    ArbitrumY2KFinanceFarmV1ContractPositionFetcher,
    ArbitrumY2KFinanceMintV1ContractPositionFetcher,
    ArbitrumY2KFinanceMintV2ContractPositionFetcher,
    ArbitrumY2KFinanceVotingLockedContractPositionFetcher,
  ],
})
export class Y2KFinanceAppModule extends AbstractApp() {}
