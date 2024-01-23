import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { YearnViemContractFactory } from './contracts';
import { EthereumYearnGovernanceContractPositionFetcher } from './ethereum/yearn.governance.contract-position-fetcher';
import { EthereumYearnStakingRewardContractPositionFetcher } from './ethereum/yearn.staking-reward.contract-position-fetcher';
import { EthereumYearnVeYfiContractPositionFetcher } from './ethereum/yearn.ve-yfi.contract-position-fetcher';
import { OptimismYearnSakingContractPositionFetcher } from './optimism/yearn.staking.contract-position-fetcher';

@Module({
  providers: [
    YearnViemContractFactory,
    // Ethereum
    EthereumYearnGovernanceContractPositionFetcher,
    EthereumYearnVeYfiContractPositionFetcher,
    EthereumYearnStakingRewardContractPositionFetcher,
    // Optimism
    OptimismYearnSakingContractPositionFetcher,
  ],
})
export class YearnAppModule extends AbstractApp() {}
