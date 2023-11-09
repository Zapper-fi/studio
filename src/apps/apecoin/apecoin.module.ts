import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ApecoinViemContractFactory } from './contracts';
import { EthereumApecoinStakingContractPositionFetcher } from './ethereum/apecoin.staking.contract-position-fetcher';

@Module({
  providers: [ApecoinContractFactory, EthereumApecoinStakingContractPositionFetcher],
})
export class ApecoinAppModule extends AbstractApp() {}
