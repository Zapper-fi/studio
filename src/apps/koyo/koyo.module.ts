import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraKoyoPoolTokenFetcher } from './aurora/koyo.pool.token-fetcher';
import { KoyoContractFactory } from './contracts';
import { KoyoPoolTokensHelper } from './helpers/koyo.pool.token-helper';
import { KoyoTheGraphPoolTokenDataStrategy } from './helpers/koyo.the-graph.pool-token-address-strategy';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  providers: [
    AuroraKoyoPoolTokenFetcher,
    KoyoAppDefinition,
    KoyoContractFactory,
    KoyoPoolTokensHelper,
    KoyoTheGraphPoolTokenDataStrategy,
  ],
  exports: [KoyoPoolTokensHelper, KoyoTheGraphPoolTokenDataStrategy],
})
export class KoyoAppModule extends AbstractApp() {}
