import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DystopiaViemContractFactory } from './contracts';
import { PolygonDystopiaStakingContractPositionFetcher } from './polygon/dystopia.farm.contract-position-fetcher';
import { PolygonDystopiaVotingEscrowContractPositionFetcher } from './polygon/dystopia.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    DystopiaViemContractFactory,
    PolygonDystopiaStakingContractPositionFetcher,
    PolygonDystopiaVotingEscrowContractPositionFetcher,
  ],
})
export class DystopiaAppModule extends AbstractApp() {}
