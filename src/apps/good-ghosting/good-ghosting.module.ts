import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { GoodGhostingContractFactory } from './contracts';
import { GoodGhostingAppDefinition, GOOD_GHOSTING_DEFINITION } from './good-ghosting.definition';
import { GoodGhostingGameConfigFetcherHelper } from './helpers/good-ghosting.game.config-fetcher';
import { PolygonGoodGhostingGameContractPositionFetcher } from './polygon/good-ghosting.game.contract-position-fetcher';
import { GoodGhostingGameContractPositionFetcherHelper } from './helpers/good-ghosting.game.contract-position-fetcher-helper';
import { CeloGoodGhostingGameContractPositionFetcher } from './celo/good-ghosting.game.contract-position-fetcher';
import { PolygonGoodGhostingBalanceFetcher } from './polygon/good-ghosting.balance-fetcher';
import { CeloGoodGhostingBalanceFetcher } from './celo/good-ghosting.balance-fetcher';
import { GoodGhostingBalanceFetcherHelper } from './helpers/good-ghosting.balance-fetcher-helper';

@Register.AppModule({
  appId: GOOD_GHOSTING_DEFINITION.id,
  providers: [
    GoodGhostingAppDefinition,
    GoodGhostingContractFactory,
    PolygonGoodGhostingBalanceFetcher,
    PolygonGoodGhostingGameContractPositionFetcher,
    GoodGhostingGameContractPositionFetcherHelper,
    CeloGoodGhostingGameContractPositionFetcher,
    GoodGhostingBalanceFetcherHelper,
    GoodGhostingGameConfigFetcherHelper,
    CeloGoodGhostingBalanceFetcher,
  ],
})
export class GoodGhostingAppModule extends AbstractApp() {}
