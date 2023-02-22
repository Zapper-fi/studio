import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarContractFactory } from './contracts';
import { EthereumOriginDollarRewardsContractPositionFetcher } from './ethereum/origin-dollar.rewards.contract-position-fetcher';
import { EthereumOriginDollarVoteEscrowedTokenFetcher } from './ethereum/origin-dollar.vote-escrowed.token-fetcher';
import { EthereumOriginDollarWousdTokenFetcher } from './ethereum/origin-dollar.wousd.token-fetcher';

@Module({
  providers: [
    OriginDollarContractFactory,
    // Ethereum
    EthereumOriginDollarRewardsContractPositionFetcher,
    EthereumOriginDollarVoteEscrowedTokenFetcher,
    EthereumOriginDollarWousdTokenFetcher,
  ],
})
export class OriginDollarAppModule extends AbstractApp() {}
