import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ViemContractFactory } from '~apps/balancer-v2/contracts';

import { PolygonKoyoPoolTokenFetcher } from './polygon/koyo.pool.token-fetcher';

@Module({
  providers: [BalancerV2ViemContractFactory, PolygonKoyoPoolTokenFetcher],
})
export class KoyoAppModule extends AbstractApp() {}
