import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { UnipilotVaultDefinitionsResolver } from './common/unipilot.vault-definition-resolver';
import { UnipilotContractFactory } from './contracts';
import { EthereumUnipilotPoolTokenFetcher } from './ethereum/unipilot.pool.token-fetcher';
import { UnipilotVaultAPYHelper } from './helpers/unipilot-vault.apy.helper';
import { PolygonUnipilotPoolTokenFetcher } from './polygon/unipilot.pool.token-fetcher';
import { UnipilotAppDefinition, UNIPILOT_DEFINITION } from './unipilot.definition';

@Register.AppModule({
  appId: UNIPILOT_DEFINITION.id,
  providers: [
    UnipilotAppDefinition,
    UnipilotContractFactory,
    UnipilotVaultDefinitionsResolver,
    UnipilotVaultAPYHelper,
    // Ethereum
    EthereumUnipilotPoolTokenFetcher,
    // Polygon
    PolygonUnipilotPoolTokenFetcher,
  ],
})
export class UnipilotAppModule extends AbstractApp() {}
