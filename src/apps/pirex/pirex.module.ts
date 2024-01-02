import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumPirexPxGlpTokenFetcher } from './arbitrum/pirex.pxglp.token-fetcher';
import { ArbitrumPirexPxGmxTokenFetcher } from './arbitrum/pirex.pxgmx.token-fetcher';
import { PirexViemContractFactory } from './contracts';
import { EthereumPirexPxBtrflyTokenFetcher } from './ethereum/pirex.pxbtrfly.token-fetcher';
import { EthereumPirexPxCvxTokenFetcher } from './ethereum/pirex.pxcvx.token-fetcher';

@Module({
  providers: [
    ArbitrumPirexPxGlpTokenFetcher,
    ArbitrumPirexPxGmxTokenFetcher,
    EthereumPirexPxCvxTokenFetcher,
    EthereumPirexPxBtrflyTokenFetcher,
    PirexViemContractFactory,
  ],
})
export class PirexAppModule extends AbstractApp() {}
