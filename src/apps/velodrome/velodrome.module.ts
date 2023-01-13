import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.farm.contract-position-fetcher';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pool.token-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';
import { VelodromeAppDefinition } from './velodrome.definition';

@Module({
  providers: [
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,

    VelodromeContractFactory,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
