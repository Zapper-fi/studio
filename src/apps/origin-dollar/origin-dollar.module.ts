import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarContractFactory } from './contracts';
import { EthereumOriginDollarRewardsContractPositionFetcher } from './ethereum/origin-dollar.rewards.contract-position-fetcher';
import { EthereumOriginDollarVeogvTokenFetcher } from './ethereum/origin-dollar.veogv.token-fetcher';
import { EthereumOriginDollarWousdTokenFetcher } from './ethereum/origin-dollar.wousd.token-fetcher';
import { OriginDollarAppDefinition } from './origin-dollar.definition';

@Module({
  providers: [
    OriginDollarContractFactory,
    // Ethereum
    EthereumOriginDollarRewardsContractPositionFetcher,
    EthereumOriginDollarVeogvTokenFetcher,
    EthereumOriginDollarWousdTokenFetcher,
  ],
})
export class OriginDollarAppModule extends AbstractApp() {}
