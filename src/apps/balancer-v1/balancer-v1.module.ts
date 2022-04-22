import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { BalancerV1AppDefinition } from './balancer-v1.definition';
import { EthereumBalancerV1BalanceFetcher } from './ethereum/balancer-v1.balance-fetcher';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.token-fetcher';

@Module({
  providers: [BalancerV1AppDefinition, EthereumBalancerV1PoolTokenFetcher, EthereumBalancerV1BalanceFetcher],
})
export class BalancerV1AppModule extends AbstractDynamicApp<BalancerV1AppModule>() {}
