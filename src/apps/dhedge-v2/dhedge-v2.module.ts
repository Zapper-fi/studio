import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { DhedgeV2ContractFactory } from './contracts';
import { DhedgeV2AppDefinition, DHEDGE_V_2_DEFINITION } from './dhedge-v2.definition';
import { OptimismDhedgeV2BalanceFetcher } from './optimism/dhedge-v2.balance-fetcher';
import { OptimismDhedgeV2PoolTokenFetcher } from './optimism/dhedge-v2.pool.token-fetcher';
import { PolygonDhedgeV2BalanceFetcher } from './polygon/dhedge-v2.balance-fetcher';
import { PolygonDhedgeV2PoolTokenFetcher } from './polygon/dhedge-v2.pool.token-fetcher';

@Register.AppModule({
  appId: DHEDGE_V_2_DEFINITION.id,
  providers: [
    DhedgeV2AppDefinition,
    DhedgeV2ContractFactory,
    OptimismDhedgeV2BalanceFetcher,
    OptimismDhedgeV2PoolTokenFetcher,
    PolygonDhedgeV2BalanceFetcher,
    PolygonDhedgeV2PoolTokenFetcher,
  ],
})
export class DhedgeV2AppModule extends AbstractApp() {}
