import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarGovernanceViemContractFactory } from './contracts';
import { EthereumOriginDollarGovernanceRewardsContractPositionFetcher } from './ethereum/origin-dollar-governance.rewards.contract-position-fetcher';
import { EthereumOriginDollarGovernanceVoteEscrowedTokenFetcher } from './ethereum/origin-dollar-governance.vote-escrowed.token-fetcher';
import { EthereumOriginDollarGovernanceWousdTokenFetcher } from './ethereum/origin-dollar-governance.wousd.token-fetcher';

@Module({
  providers: [
    OriginDollarGovernanceViemContractFactory,
    // Ethereum
    EthereumOriginDollarGovernanceRewardsContractPositionFetcher,
    EthereumOriginDollarGovernanceVoteEscrowedTokenFetcher,
    EthereumOriginDollarGovernanceWousdTokenFetcher,
  ],
})
export class OriginDollarAppModule extends AbstractApp() {}
