import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ClearpoolAppDefinition } from './clearpool.definition';
import { ClearpoolContractFactory } from './contracts';
import { EthereumClearpoolPoolTokenFetcher } from './ethereum/clearpool.pool.token-fetcher';
import { PolygonClearpoolPoolTokenFetcher } from './polygon/clearpool.pool.token-fetcher';

@Module({
  providers: [
    ClearpoolAppDefinition,
    ClearpoolContractFactory,
    EthereumClearpoolPoolTokenFetcher,
    PolygonClearpoolPoolTokenFetcher,
  ],
})
export class ClearpoolAppModule extends AbstractApp() {}
