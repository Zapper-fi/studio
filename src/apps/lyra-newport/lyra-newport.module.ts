import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LyraNewportContractFactory } from './contracts';
import { EthereumLyraNewportStkLyraTokenFetcher } from './ethereum/lyra-newport.stk-lyra.token-fetcher';
import { EthereumLyraNewportStakingContractPositionFetcher } from './ethereum/lyra-newport.staking.contract-position-fetcher';
import { ArbitrumLyraNewportOptionsContractPositionFetcher } from './arbitrum/lyra-newport.options.contract-position-fetcher';
import { ArbitrumLyraNewportPoolTokenFetcher } from './arbitrum/lyra-newport.pool.token-fetcher';

@Module({
  providers: [
    LyraNewportContractFactory,
    ArbitrumLyraNewportOptionsContractPositionFetcher,
    ArbitrumLyraNewportPoolTokenFetcher,
    EthereumLyraNewportStkLyraTokenFetcher,
    EthereumLyraNewportStakingContractPositionFetcher,
  ],
})
export class LyraNewportAppModule extends AbstractApp() { }
