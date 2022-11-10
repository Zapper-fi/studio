import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CeloGoodGhostingGameContractPositionFetcher } from './celo/good-ghosting.game.contract-position-fetcher';
import { GoodGhostingGameBalancesApiSource } from './common/good-ghosting.game.balances.api-source';
import { GoodGhostingGameGamesApiSource } from './common/good-ghosting.game.games.api-source';
import { GoodGhostingContractFactory } from './contracts';
import { GoodGhostingAppDefinition, GOOD_GHOSTING_DEFINITION } from './good-ghosting.definition';
import { PolygonGoodGhostingGameContractPositionFetcher } from './polygon/good-ghosting.game.contract-position-fetcher';

@Register.AppModule({
  appId: GOOD_GHOSTING_DEFINITION.id,
  providers: [
    GoodGhostingAppDefinition,
    GoodGhostingContractFactory,
    // Helpers
    GoodGhostingGameBalancesApiSource,
    GoodGhostingGameGamesApiSource,
    // Polygon
    PolygonGoodGhostingGameContractPositionFetcher,
    // Celo
    CeloGoodGhostingGameContractPositionFetcher,
  ],
})
export class GoodGhostingAppModule extends AbstractApp() {}
