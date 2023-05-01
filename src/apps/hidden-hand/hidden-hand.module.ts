import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { HiddenHandContractFactory } from './contracts';
import { EthereumHiddenHandRewardsContractPositionFetcher } from './ethereum/hidden-hand.rewards.contract-position-fetcher';
import { OptimismHiddenHandRewardsContractPositionFetcher } from './optimism/hidden-hand.rewards.contract-position-fetcher';
import { HiddenHandRewardsResolver } from './common/hidden-hand.rewards-resolver';

@Module({
  providers: [
    HiddenHandRewardsResolver,
    EthereumHiddenHandRewardsContractPositionFetcher,
    OptimismHiddenHandRewardsContractPositionFetcher,
    HiddenHandContractFactory,
  ],
})
export class HiddenHandAppModule extends AbstractApp() { }
