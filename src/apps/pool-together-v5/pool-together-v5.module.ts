import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PoolTogetherV5ViemContractFactory } from './contracts';
import { OptimismPoolTogetherV5PrizeVaultTokenFetcher } from './optimism/pool-together-v5.prize-vault.token-fetcher';

@Module({
  providers: [PoolTogetherV5ViemContractFactory, OptimismPoolTogetherV5PrizeVaultTokenFetcher],
})
export class PoolTogetherV5AppModule extends AbstractApp() {}
