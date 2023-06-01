import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPirexApxglpTokenFetcher } from './arbitrum/pirex.apxglp.token-fetcher';
import { ArbitrumPirexApxgmxTokenFetcher } from './arbitrum/pirex.apxgmx.token-fetcher';
import { ArbitrumPirexPxGlpTokenFetcher } from './arbitrum/pirex.pxglp.token-fetcher';
import { ArbitrumPirexPxGmxTokenFetcher } from './arbitrum/pirex.pxgmx.token-fetcher';
import { PirexContractFactory } from './contracts';
import { EthereumPirexApxBtrflyTokenFetcher } from './ethereum/pirex.apxbtrfly.token-fetcher';
import { EthereumPirexPxBtrflyTokenFetcher } from './ethereum/pirex.pxbtrfly.token-fetcher';
import { EthereumPirexPxCvxTokenFetcher } from './ethereum/pirex.pxcvx.token-fetcher';

@Module({
  providers: [
    ArbitrumPirexApxgmxTokenFetcher,
    ArbitrumPirexApxglpTokenFetcher,
    ArbitrumPirexPxGlpTokenFetcher,
    ArbitrumPirexPxGmxTokenFetcher,
    EthereumPirexApxBtrflyTokenFetcher,
    EthereumPirexPxCvxTokenFetcher,
    EthereumPirexPxBtrflyTokenFetcher,
    PirexContractFactory,
  ],
})
export class PirexAppModule extends AbstractApp() { }
