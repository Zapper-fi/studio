import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { GoodGhostingContractFactory } from './contracts';
import { GoodGhostingAppDefinition, GOOD_GHOSTING_DEFINITION } from './good-ghosting.definition';
import { GoodGhostingBalanceFetcherHelper } from './helpers/good-ghosting.balance-fetcher-helper';
import { GoodGhostingGameConfigFetcherHelper } from './helpers/good-ghosting.game.config-fetcher';
import { GoodGhostingGameContractPositionFetcherHelper } from './helpers/good-ghosting.game.contract-position-fetcher-helper';
import { PolygonGoodGhostingBalanceFetcher } from './polygon/good-ghosting.balance-fetcher';
import { PolygonGoodGhostingGameContractPositionFetcher } from './polygon/good-ghosting.game.contract-position-fetcher';

@Register.AppModule({
  appId: GOOD_GHOSTING_DEFINITION.id,
  providers: [
    GoodGhostingAppDefinition,
    GoodGhostingContractFactory,
    PolygonGoodGhostingBalanceFetcher,
    PolygonGoodGhostingGameContractPositionFetcher,
    GoodGhostingGameContractPositionFetcherHelper,
    GoodGhostingBalanceFetcherHelper,
    GoodGhostingGameConfigFetcherHelper,
  ],
})
export class GoodGhostingAppModule extends AbstractApp() {}
