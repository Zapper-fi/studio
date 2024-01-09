import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ViemContractFactory } from '~apps/balancer-v2/contracts';

import { BeethovenXViemContractFactory } from './contracts';
import { FantomBeethovenXChefContractPositionFetcher } from './fantom/beethoven-x.chef.contract-position-fetcher';
import { FantomBeethovenXPoolTokenFetcher } from './fantom/beethoven-x.pool.token-fetcher';
import { OptimismBeethovenXFarmContractPositionFetcher } from './optimism/beethoven-x.farm.contract-position-fetcher';
import { OptimismBeethovenXPoolTokenFetcher } from './optimism/beethoven-x.pool.token-fetcher';

@Module({
  providers: [
    BeethovenXViemContractFactory,
    BalancerV2ViemContractFactory,
    // Fantom
    FantomBeethovenXChefContractPositionFetcher,
    FantomBeethovenXPoolTokenFetcher,
    // Optimism
    OptimismBeethovenXFarmContractPositionFetcher,
    OptimismBeethovenXPoolTokenFetcher,
  ],
})
export class BeethovenXAppModule extends AbstractApp() {}
