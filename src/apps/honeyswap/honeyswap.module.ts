import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { HoneyswapViemContractFactory } from './contracts';
import { GnosisHoneyswapPoolTokenFetcher } from './gnosis/honeyswap.pool.token-fetcher';
import { PolygonHoneyswapPoolTokenFetcher } from './polygon/honeyswap.pool.token-fetcher';

@Module({
  providers: [
    HoneyswapViemContractFactory,
    UniswapV2ViemContractFactory,
    // Gnosis
    GnosisHoneyswapPoolTokenFetcher,
    // Polygon
    PolygonHoneyswapPoolTokenFetcher,
  ],
})
export class HoneyswapAppModule extends AbstractApp() {}
