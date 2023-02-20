import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { Api3ContractFactory } from './contracts';
import { EthereumApi3StakingContractPositionFetcher } from './ethereum/api3.staking.contract-position-fetcher';

@Module({
  providers: [Api3ContractFactory, EthereumApi3StakingContractPositionFetcher],
})
export class Api3AppModule extends AbstractApp() {}
