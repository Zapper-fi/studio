import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IdleContractFactory } from './contracts';
import { EthereumIdleBalanceFetcher } from './ethereum/idle.balance-fetcher';
import { EthereumIdleVaultTokenFetcher } from './ethereum/idle.vault.token-fetcher';
import IDLE_DEFINITION, { IdleAppDefinition } from './idle.definition';

@Register.AppModule({
  appId: IDLE_DEFINITION.id,
  imports: [],
  providers: [IdleAppDefinition, IdleContractFactory, EthereumIdleBalanceFetcher, EthereumIdleVaultTokenFetcher],
})
export class IdleAppModule extends AbstractApp() {}
