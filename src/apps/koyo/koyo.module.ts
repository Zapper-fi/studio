import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ContractFactory } from '~apps/balancer-v2/contracts/index';

import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';
import { MoonriverKoyoPoolTokenFetcher } from './moonriver/koyo.pool.token-fetcher';
import { PolygonKoyoPoolTokenFetcher } from './polygon/koyo.pool.token-fetcher';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  providers: [
    BalancerV2ContractFactory,
    AuroraKoyoPoolTokenFetcher,
    MoonriverKoyoPoolTokenFetcher,
    PolygonKoyoPoolTokenFetcher,
    KoyoAppDefinition,
  ],
})
export class KoyoAppModule extends AbstractApp() {}
