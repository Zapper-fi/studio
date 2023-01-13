import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BalancerV1ContractFactory } from './contracts';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.pool.token-fetcher';
import { EthereumBalancerV1PoolSubgraphVolumeDataLoader } from './ethereum/balancer-v1.volume.data-loader';

@Module({
  providers: [
    BalancerV1ContractFactory,
    EthereumBalancerV1PoolTokenFetcher,
    EthereumBalancerV1PoolSubgraphVolumeDataLoader,
  ],
})
export class BalancerV1AppModule extends AbstractApp() {}
