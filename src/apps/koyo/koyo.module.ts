import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ContractFactory } from '~apps/balancer-v2/contracts/index';
import { BalancerV2PoolTokensHelper } from '~apps/balancer-v2/helpers/balancer-v2.pool.token-helper';
import { BalancerV2TheGraphPoolTokenDataStrategy } from '~apps/balancer-v2/helpers/balancer-v2.the-graph.pool-token-address-strategy';

import { AuroraKoyoBalanceFetcher } from './aurora/koyo.balance-fetcher';
import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';
import { MoonriverKoyoBalanceFetcher } from './moonriver/koyo.balance-fetcher';
import { MoonriverKoyoPoolTokenFetcher } from './moonriver/koyo.pool.token-fetcher';
import { PolygonKoyoBalanceFetcher } from './polygon/koyo.balance-fetcher';
import { PolygonKoyoPoolTokenFetcher } from './polygon/koyo.pool.token-fetcher';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  providers: [
    BalancerV2ContractFactory,
    BalancerV2TheGraphPoolTokenDataStrategy,
    BalancerV2PoolTokensHelper,
    AuroraKoyoPoolTokenFetcher,
    AuroraKoyoBalanceFetcher,
    MoonriverKoyoPoolTokenFetcher,
    MoonriverKoyoBalanceFetcher,
    PolygonKoyoBalanceFetcher,
    PolygonKoyoPoolTokenFetcher,
    KoyoAppDefinition,
  ],
})
export class KoyoAppModule extends AbstractApp() {}
