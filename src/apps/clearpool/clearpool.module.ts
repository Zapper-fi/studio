import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ClearpoolContractFactory } from './contracts';
import { EthereumClearpoolPoolTokenFetcher } from './ethereum/clearpool.pool.token-fetcher';
import { PolygonClearpoolPoolTokenFetcher } from './polygon/clearpool.pool.token-fetcher';

@Module({
  providers: [ClearpoolContractFactory, EthereumClearpoolPoolTokenFetcher, PolygonClearpoolPoolTokenFetcher],
})
export class ClearpoolAppModule extends AbstractApp() {}
