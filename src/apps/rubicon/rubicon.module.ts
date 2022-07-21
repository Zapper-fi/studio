import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconContractFactory } from './contracts';
import { OptimismRubiconBalanceFetcher } from './optimism/rubicon.balance-fetcher';
import { OptimismRubiconBathTokenTokenFetcher } from './optimism/rubicon.bath-token.token-fetcher';
import { RubiconAppDefinition, RUBICON_DEFINITION } from './rubicon.definition';

@Register.AppModule({
  appId: RUBICON_DEFINITION.id,
  providers: [
    OptimismRubiconBalanceFetcher,
    OptimismRubiconBathTokenTokenFetcher,
    RubiconAppDefinition,
    RubiconContractFactory,
  ],
})
export class RubiconAppModule extends AbstractApp() { }
