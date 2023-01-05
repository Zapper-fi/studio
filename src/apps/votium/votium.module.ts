import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VotiumContractFactory } from './contracts';
import { EthereumVotiumClaimableContractPositionFetcher } from './ethereum/votium.claimable.contract-position-fetcher';
import { EthereumVotiumMerkleCache } from './ethereum/votium.merkle-cache';
import { VotiumAppDefinition } from './votium.definition';

@Module({
  providers: [
    EthereumVotiumClaimableContractPositionFetcher,
    EthereumVotiumMerkleCache,
    VotiumAppDefinition,
    VotiumContractFactory,
  ],
})
export class VotiumAppModule extends AbstractApp() {}
