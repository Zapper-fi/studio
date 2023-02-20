import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeDefinitionsResolver } from './common/velodrome.definitions-resolver';
import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromeBribeContractPositionFetcher } from './optimism/velodrome.bribe.contract-position-fetcher';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.farm.contract-position-fetcher';
import { OptimismVelodromeFeesContractPositionFetcher } from './optimism/velodrome.fees.contract-position-fetcher';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pool.token-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    VelodromeContractFactory,
    VelodromeDefinitionsResolver,
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    OptimismVelodromeBribeContractPositionFetcher,
    OptimismVelodromeFeesContractPositionFetcher,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
