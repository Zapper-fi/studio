import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraKoyoBalanceFetcher } from './aurora/koyo.balance-fetcher';
import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoContractFactory } from './contracts';
import { KoyoPoolTokensHelper } from './helpers/koyo.pool.token-helper';
import { KoyoTheGraphPoolTokenDataStrategy } from './helpers/koyo.the-graph.pool-token-address-strategy';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';
import { MoonriverKoyoBalanceFetcher } from './moonriver/koyo.balance-fetcher';
import { MoonriverKoyoPoolTokenFetcher } from './moonriver/koyo.pool.token-fetcher';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  providers: [
    AuroraKoyoPoolTokenFetcher,
    AuroraKoyoBalanceFetcher,
    MoonriverKoyoPoolTokenFetcher,
    MoonriverKoyoBalanceFetcher,
    KoyoAppDefinition,
    KoyoContractFactory,
    KoyoPoolTokensHelper,
    KoyoTheGraphPoolTokenDataStrategy,
  ],
  exports: [KoyoPoolTokensHelper, KoyoTheGraphPoolTokenDataStrategy],
})
export class KoyoAppModule extends AbstractApp() {}
