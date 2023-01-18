import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { HoneyswapContractFactory } from './contracts';
import { GnosisHoneyswapPoolTokenFetcher } from './gnosis/honeyswap.pool.token-fetcher';
import { PolygonHoneyswapPoolTokenFetcher } from './polygon/honeyswap.pool.token-fetcher';

@Module({
  providers: [
    HoneyswapContractFactory,
    // Gnosis
    GnosisHoneyswapPoolTokenFetcher,
    // Polygon
    PolygonHoneyswapPoolTokenFetcher,
  ],
})
export class HoneyswapAppModule extends AbstractApp() {}
