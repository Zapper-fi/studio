import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DhedgeV2ContractFactory } from './contracts';
import { DhedgeV2AppDefinition } from './dhedge-v2.definition';
import { OptimismDhedgeV2PoolTokenFetcher } from './optimism/dhedge-v2.pool.token-fetcher';
import { PolygonDhedgeV2PoolTokenFetcher } from './polygon/dhedge-v2.pool.token-fetcher';

@Module({
  providers: [
    DhedgeV2AppDefinition,
    DhedgeV2ContractFactory,
    OptimismDhedgeV2PoolTokenFetcher,
    PolygonDhedgeV2PoolTokenFetcher,
  ],
})
export class DhedgeV2AppModule extends AbstractApp() {}
