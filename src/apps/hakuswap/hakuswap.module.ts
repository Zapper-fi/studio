import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHakuswapFarmContractPositionFetcher } from './avalanche/hakuswap.farm.contract-position-fetcher';
import { AvalancheHakuswapPoolTokenFetcher } from './avalanche/hakuswap.pool.token-fetcher';
import { AvalancheHakuswapXHakuTokenFetcher } from './avalanche/hakuswap.x-haku.token-fetcher';
import { HakuswapContractFactory } from './contracts';
import { HakuswapAppDefinition } from './hakuswap.definition';

@Module({
  providers: [
    HakuswapAppDefinition,
    HakuswapContractFactory,
    AvalancheHakuswapFarmContractPositionFetcher,
    AvalancheHakuswapPoolTokenFetcher,
    AvalancheHakuswapXHakuTokenFetcher,
  ],
})
export class HakuswapAppModule extends AbstractApp() {}
