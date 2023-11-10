import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { StakefishViemContractFactory } from './contracts';
import { EthereumStakefishStakingContractPositionFetcher } from './ethereum/stakefish.staking.contract-position-fetcher';

@Module({
  providers: [EthereumStakefishStakingContractPositionFetcher, StakefishViemContractFactory],
})
export class StakefishAppModule extends AbstractApp() {}
