import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CeloHalofiGameContractPositionFetcher } from './celo/halofi.game.contract-position-fetcher';
import { HalofiGameBalancesApiSource } from './common/halofi.game.balances.api-source';
import { HalofiGameGamesApiSource } from './common/halofi.game.games.api-source';
import { HalofiContractFactory } from './contracts';
import { PolygonHalofiGameContractPositionFetcher } from './polygon/halofi.game.contract-position-fetcher';

@Module({
  providers: [
    HalofiContractFactory,
    // Helpers
    HalofiGameBalancesApiSource,
    HalofiGameGamesApiSource,
    // Polygon
    PolygonHalofiGameContractPositionFetcher,
    // Celo
    CeloHalofiGameContractPositionFetcher,
  ],
})
export class HalofiAppModule extends AbstractApp() {}
