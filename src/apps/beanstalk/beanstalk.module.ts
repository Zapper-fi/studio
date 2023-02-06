import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BeanstalkContractFactory } from './contracts';
import { EthereumBeanstalkSiloContractPositionFetcher } from './ethereum/beanstalk.silo.contract-position-fetcher';
import { EthereumBeanstalkSiloEarnedContractPositionFetcher } from './ethereum/beanstalk.siloearned.contract-position-fetcher';

@Module({
  providers: [
    BeanstalkContractFactory,
    EthereumBeanstalkSiloContractPositionFetcher,
    EthereumBeanstalkSiloEarnedContractPositionFetcher,
  ],
})
export class BeanstalkAppModule extends AbstractApp() {}
