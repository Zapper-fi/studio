import { Module, CacheModule as NestCacheModule } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { CacheService } from './cache.service';

@Module({
  imports: [DiscoveryModule, NestCacheModule.register({ ttl: 0, max: Number.MAX_SAFE_INTEGER, isGlobal: true })],
  providers: [CacheService],
})
export class CacheModule {}
