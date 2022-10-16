import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ReaperVaultCacheManager } from './common/reaper.vault.cache-manager';
import { ReaperContractFactory } from './contracts';
import { FantomReaperVaultTokenFetcher } from './fantom/reaper.vault.token-fetcher';
import { OptimismReaperVaultTokenFetcher } from './optimism/reaper.vault.token-fetcher';
import { ReaperAppDefinition, REAPER_DEFINITION } from './reaper.definition';

@Register.AppModule({
  appId: REAPER_DEFINITION.id,
  providers: [
    ReaperAppDefinition,
    ReaperContractFactory,
    ReaperVaultCacheManager,
    FantomReaperVaultTokenFetcher,
    OptimismReaperVaultTokenFetcher,
  ],
})
export class ReaperAppModule extends AbstractApp() {}
