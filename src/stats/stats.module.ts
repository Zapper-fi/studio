import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppModule } from '~app/app.module';
import { PositionModule } from '~position/position.module';

import { TvlFetcherRegistry } from './tvl/tvl-fetcher.registry';
import { TvlController } from './tvl/tvl.controller';
import { TvlService } from './tvl/tvl.service';

@Module({
  imports: [PositionModule, DiscoveryModule, AppModule],
  providers: [TvlFetcherRegistry, TvlService],
  controllers: [TvlController],
})
export class StatsModule {}
