import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CleverContractFactory } from './contracts';
import { EthereumCleverLockContractPositionFetcher } from './ethereum/clever.clever.contract-position-fetcher';
import { EthereumCleverFarmingContractPositionFetcher } from './ethereum/clever.farming.contract-position-fetcher';
import { EthereumCleverFurnaceContractPositionFetcher } from './ethereum/clever.furnace.contract-position-fetcher';
import { EthereumCleverLeverTokenFetcher } from './ethereum/clever.lever.token-fetcher';
import { EthereumCleverPlatformFeeContractPositionFetcher } from './ethereum/clever.platform-fee.contract-position-fetcher';
import { EthereumCleverVestingContractPositionFetcher } from './ethereum/clever.vesting.contract-position-fetcher';
import { EthereumCleverVotingEscrowContractPositionFetcher } from './ethereum/clever.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    CleverContractFactory,
    EthereumCleverLeverTokenFetcher,
    EthereumCleverFurnaceContractPositionFetcher,
    EthereumCleverLockContractPositionFetcher,
    EthereumCleverFarmingContractPositionFetcher,
    EthereumCleverVestingContractPositionFetcher,
    EthereumCleverVotingEscrowContractPositionFetcher,
    EthereumCleverPlatformFeeContractPositionFetcher,
  ],
})
export class CleverAppModule extends AbstractApp() {}
