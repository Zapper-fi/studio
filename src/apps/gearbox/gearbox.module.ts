import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GearboxContractFactory } from './contracts';
import { EthereumGearboxCreditAccountsContractPositionFetcher } from './ethereum/gearbox.credit-accounts.contract-position-fetcher';
import { EthereumGearboxLendingTokenFetcher } from './ethereum/gearbox.lending.token-fetcher';
import { EthereumGearboxPhantomTokenFetcher } from './ethereum/gearbox.phantom.token-fetcher';
import { EthereumGearboxRewardsPositionFetcher } from './ethereum/gearbox.rewards.contract-position-fetcher';
import { EthereumGearboxRewardsMerkleCache } from './ethereum/gearbox.rewards.merkle-cache';

@Module({
  providers: [
    EthereumGearboxCreditAccountsContractPositionFetcher,
    EthereumGearboxLendingTokenFetcher,
    EthereumGearboxPhantomTokenFetcher,
    EthereumGearboxRewardsPositionFetcher,
    GearboxContractFactory,
    EthereumGearboxRewardsMerkleCache,
  ],
})
export class GearboxAppModule extends AbstractApp() {}
