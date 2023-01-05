import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { MeshswapContractFactory } from './contracts';
import { MeshswapAppDefinition, MESHSWAP_DEFINITION } from './meshswap.definition';
import { PolygonMeshswapPoolTokenFetcher } from './polygon/meshswap.pool.token-fetcher';
import { PolygonMeshswapSupplyTokenFetcher } from './polygon/meshswap.supply.token-fetcher';

@Register.AppModule({
  appId: MESHSWAP_DEFINITION.id,
  providers: [
    MeshswapAppDefinition,
    MeshswapContractFactory,
    UniswapV2ContractFactory,
    PolygonMeshswapPoolTokenFetcher,
    PolygonMeshswapSupplyTokenFetcher,
  ],
})
export class MeshswapAppModule extends AbstractApp() {}
