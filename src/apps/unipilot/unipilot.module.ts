import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { UnipilotVaultDefinitionsResolver } from './common/unipilot.vault-definition-resolver';
import { UnipilotContractFactory } from './contracts';
import { EthereumUnipilotPoolTokenFetcher } from './ethereum/unipilot.pool.token-fetcher';
import { PolygonUnipilotPoolTokenFetcher } from './polygon/unipilot.pool.token-fetcher';
import { UnipilotAppDefinition, UNIPILOT_DEFINITION } from './unipilot.definition';

@Register.AppModule({
  appId: UNIPILOT_DEFINITION.id,
  providers: [
    UnipilotAppDefinition,
    UnipilotContractFactory,
    UnipilotVaultDefinitionsResolver,
    //ethereum
    EthereumUnipilotPoolTokenFetcher,
    //polygon
    PolygonUnipilotPoolTokenFetcher,
  ],
})
export class UnipilotAppModule extends AbstractApp() {}
