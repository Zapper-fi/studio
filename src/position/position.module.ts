import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { PositionBalanceFetcherRegistry } from './position-balance-fetcher.registry';
import { PositionFetcherRegistry } from './position-fetcher.registry';
import { PositionSources } from './position-source';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [DiscoveryModule],
  providers: [...PositionSources, PositionService, PositionFetcherRegistry, PositionBalanceFetcherRegistry],
  controllers: [PositionController],
  exports: [PositionService, PositionFetcherRegistry, PositionBalanceFetcherRegistry],
})
export class PositionModule {}
