import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BalancerV1ViemContractFactory } from './contracts';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.pool.token-fetcher';

@Module({
  providers: [BalancerV1ViemContractFactory, EthereumBalancerV1PoolTokenFetcher],
})
export class BalancerV1AppModule extends AbstractApp() {}
