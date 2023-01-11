import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ContractFactory } from '~apps/balancer-v2/contracts';

import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoAppDefinition } from './koyo.definition';
import { MoonriverKoyoPoolTokenFetcher } from './moonriver/koyo.pool.token-fetcher';
import { PolygonKoyoPoolTokenFetcher } from './polygon/koyo.pool.token-fetcher';

@Module({
  providers: [
    BalancerV2ContractFactory,
    AuroraKoyoPoolTokenFetcher,
    MoonriverKoyoPoolTokenFetcher,
    PolygonKoyoPoolTokenFetcher,
    KoyoAppDefinition,
  ],
})
export class KoyoAppModule extends AbstractApp() {}
