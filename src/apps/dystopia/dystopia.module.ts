import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DystopiaContractFactory } from './contracts';
import { PolygonDystopiaStakingContractPositionFetcher } from './polygon/dystopia.farm.contract-position-fetcher';
import { PolygonDystopiaPairsTokenFetcher } from './polygon/dystopia.pool.token-fetcher';
import { PolygonDystopiaVotingEscrowContractPositionFetcher } from './polygon/dystopia.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    DystopiaContractFactory,
    PolygonDystopiaPairsTokenFetcher,
    PolygonDystopiaStakingContractPositionFetcher,
    PolygonDystopiaVotingEscrowContractPositionFetcher,
  ],
})
export class DystopiaAppModule extends AbstractApp() {}
