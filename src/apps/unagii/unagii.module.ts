import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiBalanceFetcher } from './ethereum/unagii.balance-fetcher';
import { EthereumUnagiiVaultTokenFetcher } from './ethereum/unagii.vault.token-fetcher';
import UNAGII_DEFINITION, { UnagiiAppDefinition } from './unagii.definition';

@Register.AppModule({
  appId: UNAGII_DEFINITION.id,
  providers: [
    UnagiiAppDefinition,
    UnagiiContractFactory,
    EthereumUnagiiVaultTokenFetcher,
    EthereumUnagiiBalanceFetcher,
  ],
})
export class UnagiiAppModule extends AbstractApp() {}
