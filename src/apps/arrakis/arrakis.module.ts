import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArrakisAppDefinition } from './arrakis.definition';
import { ArrakisPoolDefinitionsResolver } from './common/arrakis.pool-definition-resolver';
import { ArrakisContractFactory } from './contracts';
import { EthereumArrakisPoolTokenFetcher } from './ethereum/arrakis.pool.token-fetcher';
import { OptimismArrakisPoolTokenFetcher } from './optimism/arrakis.pool.token-fetcher';
import { PolygonArrakisPoolTokenFetcher } from './polygon/arrakis.pool.token-fetcher';

@Module({
  providers: [
    ArrakisAppDefinition,
    ArrakisContractFactory,
    ArrakisPoolDefinitionsResolver,
    EthereumArrakisPoolTokenFetcher,
    OptimismArrakisPoolTokenFetcher,
    PolygonArrakisPoolTokenFetcher,
  ],
})
export class ArrakisAppModule extends AbstractApp() {}
