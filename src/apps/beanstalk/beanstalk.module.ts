import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BeanstalkBalanceResolver } from './common/beanstalk.balance-resolver';
import { BeanstalkContractFactory } from './contracts';
import { EthereumBeanstalkSiloDepositContractPositionFetcher } from './ethereum/beanstalk.silo-deposit.contract-position-fetcher';
import { EthereumBeanstalkSiloEarnedContractPositionFetcher } from './ethereum/beanstalk.silo-earned.contract-position-fetcher';

@Module({
  providers: [
    BeanstalkContractFactory,
    BeanstalkBalanceResolver,
    EthereumBeanstalkSiloEarnedContractPositionFetcher,
    EthereumBeanstalkSiloDepositContractPositionFetcher,
  ],
})
export class BeanstalkAppModule extends AbstractApp() {}
