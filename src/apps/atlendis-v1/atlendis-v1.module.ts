import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AtlendisV1AppDefinition } from './atlendis-v1.definition';
import { AtlendisV1ContractFactory } from './contracts';
import { PolygonAtlendisV1PoolContractPositionFetcher } from './polygon/atlendis-v1.pool.contract-position-fetcher';

@Module({
  providers: [AtlendisV1ContractFactory, PolygonAtlendisV1PoolContractPositionFetcher],
})
export class AtlendisV1AppModule extends AbstractApp() {}
