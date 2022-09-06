import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconPoolDefinitionsResolver } from './common/rubicon.pool-definition-resolver';
import { RubiconContractFactory } from './contracts';
import { OptimismRubiconBathTokenFetcher } from './optimism/rubicon.bath.token-fetcher';
import { RubiconAppDefinition, RUBICON_DEFINITION } from './rubicon.definition';

@Register.AppModule({
  appId: RUBICON_DEFINITION.id,
  providers: [
    RubiconAppDefinition,
    RubiconContractFactory,
    RubiconPoolDefinitionsResolver,
    OptimismRubiconBathTokenFetcher,
  ],
})
export class RubiconAppModule extends AbstractApp() {}
