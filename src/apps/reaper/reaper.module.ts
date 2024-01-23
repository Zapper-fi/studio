import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumReaperVaultTokenFetcher } from './arbitrum/reaper.vault.token-fetcher';
import { BinanceSmartChainReaperVaultTokenFetcher } from './binance-smart-chain/reaper.vault.token-fetcher';
import { ReaperVaultCacheManager } from './common/reaper.vault.cache-manager';
import { ReaperViemContractFactory } from './contracts';
import { FantomReaperVaultTokenFetcher } from './fantom/reaper.vault.token-fetcher';
import { OptimismReaperVaultTokenFetcher } from './optimism/reaper.vault.token-fetcher';

@Module({
  providers: [
    ReaperViemContractFactory,
    ReaperVaultCacheManager,
    ArbitrumReaperVaultTokenFetcher,
    BinanceSmartChainReaperVaultTokenFetcher,
    FantomReaperVaultTokenFetcher,
    OptimismReaperVaultTokenFetcher,
  ],
})
export class ReaperAppModule extends AbstractApp() {}
