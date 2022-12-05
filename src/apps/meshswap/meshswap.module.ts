import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { MeshswapContractFactory } from './contracts';
import { MeshswapAppDefinition, MESHSWAP_DEFINITION } from './meshswap.definition';
import { PolygonMeshswapPoolTokenFetcher } from './polygon/meshswap.pool.token-fetcher';
import { PolygonMeshswapSupplyTokenFetcher } from './polygon/meshswap.supply.token-fetcher';

@Register.AppModule({
  appId: MESHSWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MeshswapAppDefinition,
    MeshswapContractFactory,
    // Polygon
    PolygonMeshswapPoolTokenFetcher,
    PolygonMeshswapSupplyTokenFetcher,
  ],
  exports: [],
})
export class MeshswapAppModule extends AbstractApp() {}
