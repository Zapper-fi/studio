import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GearboxViemContractFactory } from './contracts';
import { EthereumGearboxCreditAccountsContractPositionFetcher } from './ethereum/gearbox.credit-accounts.contract-position-fetcher';
import { EthereumGearboxLendingV2TokenFetcher } from './ethereum/gearbox.lending-v2.token-fetcher';
import { EthereumGearboxLendingV3TokenFetcher } from './ethereum/gearbox.lending-v3.token-fetcher';
import { EthereumGearboxRewardsPositionFetcher } from './ethereum/gearbox.rewards.contract-position-fetcher';
import { EthereumGearboxRewardsMerkleCache } from './ethereum/gearbox.rewards.merkle-cache';

@Module({
  providers: [
    GearboxViemContractFactory,
    EthereumGearboxRewardsMerkleCache,
    EthereumGearboxCreditAccountsContractPositionFetcher,
    EthereumGearboxLendingV2TokenFetcher,
    EthereumGearboxLendingV3TokenFetcher,
    EthereumGearboxRewardsPositionFetcher,
  ],
})
export class GearboxAppModule extends AbstractApp() {}
