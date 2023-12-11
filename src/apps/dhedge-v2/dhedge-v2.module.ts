import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DhedgeV2ViemContractFactory } from './contracts';
import { OptimismDhedgeV2PoolTokenFetcher } from './optimism/dhedge-v2.pool.token-fetcher';
import { OptimismDhedgeV2StakingContractPositionFetcher } from './optimism/dhedge-v2.staking.contract-position-fetcher';
import { PolygonDhedgeV2PoolTokenFetcher } from './polygon/dhedge-v2.pool.token-fetcher';

@Module({
  providers: [
    DhedgeV2ViemContractFactory,
    OptimismDhedgeV2PoolTokenFetcher,
    OptimismDhedgeV2StakingContractPositionFetcher,
    PolygonDhedgeV2PoolTokenFetcher,
  ],
})
export class DhedgeV2AppModule extends AbstractApp() {}
