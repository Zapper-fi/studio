import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { TvlController } from '~stats/tvl/tvl.controller';
import { TvlService } from '~stats/tvl/tvl.service';

import { PositionBalanceFetcherRegistry } from './position-balance-fetcher.registry';
import { PositionFetcherRegistry } from './position-fetcher.registry';
import { PositionService } from './position.service';

@Module({
  imports: [DiscoveryModule],
  providers: [TvlService],
  controllers: [TvlController],
  exports: [PositionService, PositionFetcherRegistry, PositionBalanceFetcherRegistry],
})
export class TvlModule {}
