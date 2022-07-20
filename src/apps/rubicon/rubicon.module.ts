import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconContractFactory } from './contracts';
import { OptimismRubiconBathTokenTokenFetcher } from './optimism/rubicon.bathToken.token-fetcher';
import { RubiconAppDefinition, RUBICON_DEFINITION } from './rubicon.definition';

@Register.AppModule({
  appId: RUBICON_DEFINITION.id,
  providers: [OptimismRubiconBathTokenTokenFetcher, RubiconAppDefinition, RubiconContractFactory],
})
export class RubiconAppModule extends AbstractApp() {}
