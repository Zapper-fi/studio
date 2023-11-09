import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { VotiumViemContractFactory } from './contracts';
import { EthereumVotiumClaimableContractPositionFetcher } from './ethereum/votium.claimable.contract-position-fetcher';
import { EthereumVotiumMerkleCache } from './ethereum/votium.merkle-cache';

@Module({
  providers: [EthereumVotiumClaimableContractPositionFetcher, EthereumVotiumMerkleCache, VotiumContractFactory],
})
export class VotiumAppModule extends AbstractApp() {}
