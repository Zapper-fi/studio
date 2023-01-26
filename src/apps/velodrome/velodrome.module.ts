import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.farm.contract-position-fetcher';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pool.token-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';
import { OptimismVelodromeBribeContractPositionFetcher } from './optimism/velodrome.bribe.contract-position-fetcher';

@Module({
  providers: [
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    OptimismVelodromeBribeContractPositionFetcher,

    VelodromeContractFactory,
  ],
})
export class VelodromeAppModule extends AbstractApp() { }
