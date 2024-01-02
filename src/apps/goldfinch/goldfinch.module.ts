import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GoldfinchViemContractFactory } from './contracts';
import { EthereumGoldfinchSeniorPoolContractPositionFetcher } from './ethereum/goldfinch.seniorpool.contract-position-fetcher';
import { EthereumGoldfinchStakingRewardsContractPositionFetcher } from './ethereum/goldfinch.staking-rewards.contract-position-fetcher';
import { EthereumGoldfinchVaultContractPositionFetcher } from './ethereum/goldfinch.vault.contract-position-fetcher';

@Module({
  providers: [
    GoldfinchViemContractFactory,
    EthereumGoldfinchStakingRewardsContractPositionFetcher,
    EthereumGoldfinchSeniorPoolContractPositionFetcher,
    EthereumGoldfinchVaultContractPositionFetcher,
  ],
})
export class GoldfinchAppModule extends AbstractApp() {}
