import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GoldfinchContractFactory } from './contracts';
import { EthereumGoldfinchFiduTokenFetcher } from './ethereum/goldfinch.fidu.token-fetcher';
import { EthereumGoldfinchSeniorPoolContractPositionFetcher } from './ethereum/goldfinch.seniorpool.contract-position-fetcher';
import { EthereumGoldfinchStakingRewardsContractPositionFetcher } from './ethereum/goldfinch.staking-rewards.contract-position-fetcher';
import { EthereumGoldfinchVaultContractPositionFetcher } from './ethereum/goldfinch.vault.contract-position-fetcher';

@Module({
  providers: [
    GoldfinchContractFactory,
    EthereumGoldfinchFiduTokenFetcher,
    EthereumGoldfinchStakingRewardsContractPositionFetcher,
    EthereumGoldfinchSeniorPoolContractPositionFetcher,
    EthereumGoldfinchVaultContractPositionFetcher,
  ],
})
export class GoldfinchAppModule extends AbstractApp() {}
