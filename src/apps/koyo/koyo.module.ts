import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2AppModule } from '~apps/balancer-v2';

import { AuroraKoyoBalanceFetcher } from './aurora/koyo.balance-fetcher';
import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoContractFactory } from './contracts';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';
import { MoonriverKoyoBalanceFetcher } from './moonriver/koyo.balance-fetcher';
import { MoonriverKoyoPoolTokenFetcher } from './moonriver/koyo.pool.token-fetcher';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  imports: [BalancerV2AppModule],
  providers: [
    AuroraKoyoPoolTokenFetcher,
    AuroraKoyoBalanceFetcher,
    MoonriverKoyoPoolTokenFetcher,
    MoonriverKoyoBalanceFetcher,
    KoyoAppDefinition,
    KoyoContractFactory,
  ],
})
export class KoyoAppModule extends AbstractApp() {}
