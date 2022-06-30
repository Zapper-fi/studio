import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CeloGoodGhostingBalanceFetcher } from './celo/good-ghosting.balance-fetcher';
import { CeloGoodGhostingGameContractPositionFetcher } from './celo/good-ghosting.game.contract-position-fetcher';
import { GoodGhostingContractFactory } from './contracts';
import { GoodGhostingAppDefinition, GOOD_GHOSTING_DEFINITION } from './good-ghosting.definition';
import { GoodGhostingBalanceFetcherHelper } from './helpers/good-ghosting.balance-fetcher-helper';
import { GoodGhostingGameConfigFetcherHelper } from './helpers/good-ghosting.game.config-fetcher';
import { GoodGhostingGameContractPositionFetcherHelper } from './helpers/good-ghosting.game.contract-position-fetcher-helper';
import { PolygonGoodGhostingBalanceFetcher } from './polygon/good-ghosting.balance-fetcher';
import { PolygonGoodGhostingGameContractPositionFetcher } from './polygon/good-ghosting.game.contract-position-fetcher';
import { CeloGoodGhostingBalanceFetcher } from './celo/good-ghosting.balance-fetcher';
import { CeloGoodGhostingGameContractPositionFetcher } from './celo/good-ghosting.game.contract-position-fetcher';

@Register.AppModule({
  appId: GOOD_GHOSTING_DEFINITION.id,
  providers: [
    GoodGhostingAppDefinition,
    GoodGhostingContractFactory,
    GoodGhostingGameContractPositionFetcherHelper,
    GoodGhostingGameConfigFetcherHelper,
    GoodGhostingBalanceFetcherHelper,
    // Polygon
    PolygonGoodGhostingBalanceFetcher,
    PolygonGoodGhostingGameContractPositionFetcher,
    // Celo
    CeloGoodGhostingBalanceFetcher,
    CeloGoodGhostingGameContractPositionFetcher,
  ],
})
export class GoodGhostingAppModule extends AbstractApp() {}
