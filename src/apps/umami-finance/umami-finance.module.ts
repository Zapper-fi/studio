import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUmamiFinanceCompoundTokenFetcher } from './arbitrum/umami-finance.compound.token-fetcher';
import { ArbitrumUmamiFinanceGlpVaultsTokenFetcher } from './arbitrum/umami-finance.glp-vaults.token-fetcher';
import { ArbitrumUmamiFinanceMarinateUmamiTokenFetcher } from './arbitrum/umami-finance.marinate-umami.token-fetcher';
import { ArbitrumUmamiFinanceMarinateContractPositionFetcher } from './arbitrum/umami-finance.marinate.contract-position-fetcher';
import { ArbitrumUmamiFinanceTimelockedGlpVaultsTokenFetcher } from './arbitrum/umami-finance.timelocked-glp-vaults.token-fetcher';
import { UmamiFinanceYieldResolver } from './common/umami-finance.yield-resolver';
import { UmamiFinanceContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumUmamiFinanceCompoundTokenFetcher,
    ArbitrumUmamiFinanceGlpVaultsTokenFetcher,
    ArbitrumUmamiFinanceMarinateContractPositionFetcher,
    ArbitrumUmamiFinanceMarinateUmamiTokenFetcher,
    ArbitrumUmamiFinanceTimelockedGlpVaultsTokenFetcher,
    UmamiFinanceContractFactory,
    UmamiFinanceYieldResolver,
  ],
})
export class UmamiFinanceAppModule extends AbstractApp() {}
