import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AtlendisV1AppDefinition, ATLENDIS_V_1_DEFINITION } from './atlendis-v1.definition';
import { AtlendisV1ContractFactory } from './contracts';
import { PolygonAtlendisV1PoolContractPositionFetcher } from './polygon/atlendis-v1.pool.contract-position-fetcher';

@Register.AppModule({
  appId: ATLENDIS_V_1_DEFINITION.id,
  providers: [AtlendisV1AppDefinition, AtlendisV1ContractFactory, PolygonAtlendisV1PoolContractPositionFetcher],
})
export class AtlendisV1AppModule extends AbstractApp() {}
