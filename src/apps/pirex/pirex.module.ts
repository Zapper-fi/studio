import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPirexApxglpTokenFetcher } from './arbitrum/pirex.apxglp.token-fetcher';
import { ArbitrumPirexApxgmxTokenFetcher } from './arbitrum/pirex.apxgmx.token-fetcher';
import { ArbitrumPirexPxGlpTokenFetcher } from './arbitrum/pirex.pxglp.token-fetcher';
import { ArbitrumPirexPxGmxTokenFetcher } from './arbitrum/pirex.pxgmx.token-fetcher';
import { PirexContractFactory } from './contracts';
import { EthereumPirexPxCvxTokenFetcher } from './ethereum/pirex.pxcvx.token-fetcher';

@Module({
  providers: [
    ArbitrumPirexApxgmxTokenFetcher,
    ArbitrumPirexApxglpTokenFetcher,
    ArbitrumPirexPxGlpTokenFetcher,
    ArbitrumPirexPxGmxTokenFetcher,
    EthereumPirexPxCvxTokenFetcher,
    PirexContractFactory,
  ],
})
export class PirexAppModule extends AbstractApp() {}
