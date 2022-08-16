import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { MeshswapContractFactory } from './contracts';
import { MeshswapSupplyBalanceHelper } from './helpers/meshpool.supply.balance-helper';
import { MeshswapAppDefinition, MESHSWAP_DEFINITION } from './meshswap.definition';
import { PolygonMeshswapBalanceFetcher } from './polygon/meshswap.balance-fetcher';
import { PolygonMeshswapPoolTokenFetcher } from './polygon/meshswap.pool.token-fetcher';
import { PolygonMeshswapSupplyTokenFetcher } from './polygon/meshswap.supply.token-fetcher';

@Register.AppModule({
  appId: MESHSWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MeshswapAppDefinition,
    MeshswapContractFactory,
    // helpers
    MeshswapSupplyBalanceHelper,
    // Polygon
    PolygonMeshswapPoolTokenFetcher,
    PolygonMeshswapSupplyTokenFetcher,
    PolygonMeshswapBalanceFetcher,
  ],
  exports: [],
})
export class MeshswapAppModule extends AbstractApp() {}
