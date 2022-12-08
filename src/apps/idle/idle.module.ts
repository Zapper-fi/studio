import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IdleContractFactory } from './contracts';
import { EthereumIdleVaultContractPositionFetcher } from './ethereum/idle.vault.contract-position-fetcher';
import { EthereumIdleVaultTokenFetcher } from './ethereum/idle.vault.token-fetcher';
import IDLE_DEFINITION, { IdleAppDefinition } from './idle.definition';

@Register.AppModule({
  appId: IDLE_DEFINITION.id,
  providers: [
    IdleAppDefinition,
    IdleContractFactory,
    EthereumIdleVaultContractPositionFetcher,
    EthereumIdleVaultTokenFetcher,
  ],
})
export class IdleAppModule extends AbstractApp() {}
