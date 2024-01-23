import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossViemContractFactory } from './contracts';
import { EthereumStakingContractPositionFetcher } from './ethereum/across.staking.contract-position-fetcher';

@Module({
  providers: [AcrossViemContractFactory, EthereumStakingContractPositionFetcher],
})
export class AcrossAppModule extends AbstractApp() {}
