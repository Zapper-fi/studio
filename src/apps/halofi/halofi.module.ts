import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BaseHalofiGameContractPositionFetcher } from './base/halofi.game.contract-position-fetcher';
import { CeloHalofiGameContractPositionFetcher } from './celo/halofi.game.contract-position-fetcher';
import { HalofiGameGamesApiSource } from './common/halofi.game.games.api-source';
import { HalofiViemContractFactory } from './contracts';
import { PolygonHalofiGameContractPositionFetcher } from './polygon/halofi.game.contract-position-fetcher';

@Module({
  providers: [
    HalofiViemContractFactory,
    // Helpers
    HalofiGameGamesApiSource,
    // Polygon
    PolygonHalofiGameContractPositionFetcher,
    // Celo
    CeloHalofiGameContractPositionFetcher,
    // Base
    BaseHalofiGameContractPositionFetcher,
  ],
})
export class HalofiAppModule extends AbstractApp() {}
