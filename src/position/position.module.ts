import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { PositionFetcherRegistry } from './position-fetcher.registry';
import { PositionSources } from './position-source';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [DiscoveryModule],
  providers: [...PositionSources, PositionService, PositionFetcherRegistry],
  controllers: [PositionController],
  exports: [PositionService],
})
export class PositionModule {}
