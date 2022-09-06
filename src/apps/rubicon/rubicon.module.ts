import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconPoolDefinitionsResolver } from './common/rubicon.pool-definition-resolver';
import { RubiconContractFactory } from './contracts';
import { OptimismRubiconPoolTokenFetcher } from './optimism/rubicon.pool.token-fetcher';
import { RubiconAppDefinition, RUBICON_DEFINITION } from './rubicon.definition';

@Register.AppModule({
  appId: RUBICON_DEFINITION.id,
  providers: [
    RubiconAppDefinition,
    RubiconContractFactory,
    RubiconPoolDefinitionsResolver,
    OptimismRubiconPoolTokenFetcher,
  ],
})
export class RubiconAppModule extends AbstractApp() {}
