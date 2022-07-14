import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PirexContractFactory } from './contracts';
import { EthereumPirexVaultTokenFetcher } from './ethereum/pirex.vault.token-fetcher';
import { PirexAppDefinition, PIREX_DEFINITION } from './pirex.definition';

@Register.AppModule({
  appId: PIREX_DEFINITION.id,
  providers: [EthereumPirexVaultTokenFetcher, PirexAppDefinition, PirexContractFactory],
})
export class PirexAppModule extends AbstractApp() {}
