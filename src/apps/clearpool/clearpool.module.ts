import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ClearpoolPoolDefinitionsResolver } from './common/clearpool.pool-definition-resolver';
import { ClearpoolContractFactory } from './contracts';
import { EthereumClearpoolPoolTokenFetcher } from './ethereum/clearpool.pool.token-fetcher';
import { PolygonClearpoolPoolTokenFetcher } from './polygon/clearpool.pool.token-fetcher';

@Module({
  providers: [
    ClearpoolContractFactory,
    ClearpoolPoolDefinitionsResolver,
    // Ethereum
    EthereumClearpoolPoolTokenFetcher,
    // Polygon
    PolygonClearpoolPoolTokenFetcher,
  ],
})
export class ClearpoolAppModule extends AbstractApp() {}
