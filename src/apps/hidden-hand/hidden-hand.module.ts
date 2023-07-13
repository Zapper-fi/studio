import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumHiddenHandRewardsContractPositionFetcher } from './arbitrum/hidden-hand.rewards.contract-position-fetcher';
import { HiddenHandRewardsResolver } from './common/hidden-hand.rewards-resolver';
import { HiddenHandContractFactory } from './contracts';
import { EthereumHiddenHandRewardsContractPositionFetcher } from './ethereum/hidden-hand.rewards.contract-position-fetcher';
import { OptimismHiddenHandRewardsContractPositionFetcher } from './optimism/hidden-hand.rewards.contract-position-fetcher';

@Module({
  providers: [
    HiddenHandRewardsResolver,
    EthereumHiddenHandRewardsContractPositionFetcher,
    OptimismHiddenHandRewardsContractPositionFetcher,
    ArbitrumHiddenHandRewardsContractPositionFetcher,
    HiddenHandContractFactory,
  ],
})
export class HiddenHandAppModule extends AbstractApp() { }
