import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ReaperVaultCacheManager } from './common/reaper.vault.cache-manager';
import { ReaperContractFactory } from './contracts';
import { FantomReaperVaultTokenFetcher } from './fantom/reaper.vault.token-fetcher';
import { OptimismReaperVaultTokenFetcher } from './optimism/reaper.vault.token-fetcher';
import { ReaperAppDefinition } from './reaper.definition';

@Module({
  providers: [
    ReaperAppDefinition,
    ReaperContractFactory,
    ReaperVaultCacheManager,
    FantomReaperVaultTokenFetcher,
    OptimismReaperVaultTokenFetcher,
  ],
})
export class ReaperAppModule extends AbstractApp() {}
