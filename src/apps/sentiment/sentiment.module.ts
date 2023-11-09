import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSentimentBorrowContractPositionFetcher } from './arbitrum/sentiment.borrow.contract-position-fetcher';
import { ArbitrumSentimentSupplyTokenFetcher } from './arbitrum/sentiment.supply.token-fetcher';
import { SentimentAccountsResolver } from './common/sentiment.accounts-resolver';
import { SentimentViemContractFactory } from './contracts';

@Module({
  providers: [
    SentimentViemContractFactory,
    SentimentAccountsResolver,
    ArbitrumSentimentSupplyTokenFetcher,
    ArbitrumSentimentBorrowContractPositionFetcher,
  ],
})
export class SentimentAppModule extends AbstractApp() {}
