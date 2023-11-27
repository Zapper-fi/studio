import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeDefinitionsResolver } from './common/velodrome.definitions-resolver';
import { VelodromeViemContractFactory } from './contracts';
import { OptimismVelodromeBribeContractPositionFetcher } from './optimism/velodrome.bribe.contract-position-fetcher';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.farm.contract-position-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    VelodromeViemContractFactory,
    VelodromeDefinitionsResolver,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    OptimismVelodromeBribeContractPositionFetcher,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
