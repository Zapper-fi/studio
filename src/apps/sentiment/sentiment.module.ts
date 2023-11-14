import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSentimentBorrowContractPositionFetcher } from './arbitrum/sentiment.borrow.contract-position-fetcher';
import { ArbitrumSentimentSupplyContractPositionFetcher } from './arbitrum/sentiment.supply.contract-position-fetcher';
import { SentimentAccountsResolver } from './common/sentiment.accounts-resolver';
import { SentimentViemContractFactory } from './contracts';

@Module({
  providers: [
    SentimentViemContractFactory,
    SentimentAccountsResolver,
    ArbitrumSentimentSupplyContractPositionFetcher,
    ArbitrumSentimentBorrowContractPositionFetcher,
  ],
})
export class SentimentAppModule extends AbstractApp() {}
