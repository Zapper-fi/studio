import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHakuswapFarmContractPositionFetcher } from './avalanche/hakuswap.farm.contract-position-fetcher';
import { AvalancheHakuswapPoolTokenFetcher } from './avalanche/hakuswap.pool.token-fetcher';
import { HakuswapViemContractFactory } from './contracts';

@Module({
  providers: [
    HakuswapViemContractFactory,
    AvalancheHakuswapFarmContractPositionFetcher,
    AvalancheHakuswapPoolTokenFetcher,
  ],
})
export class HakuswapAppModule extends AbstractApp() {}
