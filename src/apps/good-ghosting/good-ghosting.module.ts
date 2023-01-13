import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CeloGoodGhostingGameContractPositionFetcher } from './celo/good-ghosting.game.contract-position-fetcher';
import { GoodGhostingGameBalancesApiSource } from './common/good-ghosting.game.balances.api-source';
import { GoodGhostingGameGamesApiSource } from './common/good-ghosting.game.games.api-source';
import { GoodGhostingContractFactory } from './contracts';
import { GoodGhostingAppDefinition } from './good-ghosting.definition';
import { PolygonGoodGhostingGameContractPositionFetcher } from './polygon/good-ghosting.game.contract-position-fetcher';

@Module({
  providers: [
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
