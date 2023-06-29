import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DhedgeV2ContractFactory } from './contracts';
import { OptimismDhedgeV2PoolTokenFetcher } from './optimism/dhedge-v2.pool.token-fetcher';
import { PolygonDhedgeV2PoolTokenFetcher } from './polygon/dhedge-v2.pool.token-fetcher';
import { OptimismDhedgeV2StakingV2TokenFetcher } from './optimism/dhedge-v2.staking-v2.token-fetcher';

@Module({
  providers: [DhedgeV2ContractFactory, OptimismDhedgeV2PoolTokenFetcher, OptimismDhedgeV2StakingV2TokenFetcher, PolygonDhedgeV2PoolTokenFetcher],
})
export class DhedgeV2AppModule extends AbstractApp() {}
