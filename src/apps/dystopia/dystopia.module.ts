import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DystopiaContractFactory } from './contracts';
import { DystopiaAppDefinition } from './dystopia.definition';
import { PolygonDystopiaStakingContractPositionFetcher } from './polygon/dystopia.farm.contract-position-fetcher';
import { PolygonDystopiaPairsTokenFetcher } from './polygon/dystopia.pool.token-fetcher';
import { PolygonDystopiaVotingEscrowContractPositionFetcher } from './polygon/dystopia.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    PolygonDystopiaPairsTokenFetcher,
    PolygonDystopiaStakingContractPositionFetcher,
    PolygonDystopiaVotingEscrowContractPositionFetcher,
    DystopiaAppDefinition,
    DystopiaContractFactory,
  ],
})
export class DystopiaAppModule extends AbstractApp() {}
