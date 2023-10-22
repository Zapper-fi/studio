import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { OptimismPoolTogetherV5PrizeVaultTokenFetcher } from './optimism/pool-together-v5.prize-vault.token-fetcher';

@Module({
  providers: [
    OptimismPoolTogetherV5PrizeVaultTokenFetcher
  ],
})
export class PoolTogetherV5AppModule extends AbstractApp() {}
