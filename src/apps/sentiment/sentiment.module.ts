import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSentimentAccountContractPositionFetcher } from './arbitrum/sentiment.account.contract-position-fetcher';
import { ArbitrumSentimentLendingTokenFetcher } from './arbitrum/sentiment.lending.token-fetcher';
import { SentimentContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumSentimentAccountContractPositionFetcher,
    ArbitrumSentimentLendingTokenFetcher,
    SentimentContractFactory,
  ],
})
export class SentimentAppModule extends AbstractApp() {}
