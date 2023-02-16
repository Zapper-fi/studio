import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LyraNewportContractFactory } from './contracts';
import { ArbitrumLyraNewportOptionsContractPositionFetcher } from './arbitrum/lyra-newport.options.contract-position-fetcher';
import { ArbitrumLyraNewportPoolTokenFetcher } from './arbitrum/lyra-newport.pool.token-fetcher';

@Module({
  providers: [
    LyraNewportContractFactory,
    ArbitrumLyraNewportOptionsContractPositionFetcher,
    ArbitrumLyraNewportPoolTokenFetcher,
  ],
})
export class LyraNewportAppModule extends AbstractApp() { }

