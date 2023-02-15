import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { HoneyswapContractFactory } from './contracts';
import { GnosisHoneyswapPoolTokenFetcher } from './gnosis/honeyswap.pool.token-fetcher';
import { PolygonHoneyswapPoolTokenFetcher } from './polygon/honeyswap.pool.token-fetcher';

@Module({
  providers: [
    HoneyswapContractFactory,
    UniswapV2ContractFactory,
    // Gnosis
    GnosisHoneyswapPoolTokenFetcher,
    // Polygon
    PolygonHoneyswapPoolTokenFetcher,
  ],
})
export class HoneyswapAppModule extends AbstractApp() {}
