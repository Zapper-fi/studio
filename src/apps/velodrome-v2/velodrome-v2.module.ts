import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeV2ContractFactory } from './contracts';
import { OptimismVelodromeV2VotingEscrowContractPositionFetcher } from './optimism/velodrome-v2.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    VelodromeV2ContractFactory,
    OptimismVelodromeV2VotingEscrowContractPositionFetcher,
  ],
})
export class VelodromeV2AppModule extends AbstractApp() { }
