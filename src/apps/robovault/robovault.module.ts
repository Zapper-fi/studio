import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheRoboVaultVaultTokenFetcher } from './avalanche/robovault.vault.token-fetcher';
import { RoboVaultApiClient } from './common/robovault.api.client';
import { RoboVaultContractFactory } from './contracts';
import { FantomRoboVaultVaultTokenFetcher } from './fantom/robovault.vault.token-fetcher';
import { RoboVaultAppDefinition, ROBO_VAULT_DEFINITION } from './robovault.definition';

@Register.AppModule({
  appId: ROBO_VAULT_DEFINITION.id,
  providers: [
    AvalancheRoboVaultVaultTokenFetcher,
    FantomRoboVaultVaultTokenFetcher,
    RoboVaultAppDefinition,
    RoboVaultContractFactory,
    RoboVaultApiClient,
  ],
})
export class RoboVaultAppModule extends AbstractApp() { }
