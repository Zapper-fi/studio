import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { CacheModule } from '~cache/cache.module';

import { AppTokenSelectorService } from './app-token-selector.service';
import { PositionBalanceFetcherRegistry } from './position-balance-fetcher.registry';
import { PositionFetcherRegistry } from './position-fetcher.registry';
import { PositionKeyService } from './position-key.service';
import { PositionSources } from './position-source';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [DiscoveryModule, CacheModule],
  providers: [
    ...PositionSources,
    AppTokenSelectorService,
    PositionBalanceFetcherRegistry,
    PositionFetcherRegistry,
    PositionKeyService,
    PositionService,
  ],
  controllers: [PositionController],
  exports: [
    AppTokenSelectorService,
    PositionBalanceFetcherRegistry,
    PositionFetcherRegistry,
    PositionKeyService,
    PositionService,
  ],
})
export class PositionModule {}
