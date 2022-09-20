import { Module, CacheModule as NestCacheModule } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { CacheOnIntervalService } from './cache-on-interval.service';
import { CacheService } from './cache.service';

@Module({
  imports: [DiscoveryModule, NestCacheModule.register({ ttl: 0, max: Number.MAX_SAFE_INTEGER, isGlobal: true })],
  providers: [CacheService, CacheOnIntervalService],
  exports: [CacheService, CacheOnIntervalService],
})
export class CacheModule {}
