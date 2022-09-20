import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconBathTokenDefinitionResolver } from './common/rubicon.bath.token-definition-resolver';
import { RubiconContractFactory } from './contracts';
import { OptimismRubiconBathTokenFetcher } from './optimism/rubicon.bath.token-fetcher';
import { RubiconAppDefinition, RUBICON_DEFINITION } from './rubicon.definition';

@Register.AppModule({
  appId: RUBICON_DEFINITION.id,
  providers: [
    RubiconAppDefinition,
    RubiconContractFactory,
    RubiconBathTokenDefinitionResolver,
    OptimismRubiconBathTokenFetcher,
  ],
})
export class RubiconAppModule extends AbstractApp() {}
