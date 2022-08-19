import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SpoolContractFactory } from './contracts';
import { EthereumSpoolBalanceFetcher } from './ethereum/spool.balance-fetcher';
import { EthereumSpoolVaultContractPositionFetcher } from './ethereum/spool.vault.contract-position-fetcher';
import { SpoolAppDefinition, SPOOL_DEFINITION } from './spool.definition';

@Register.AppModule({
  appId: SPOOL_DEFINITION.id,
  providers: [
    EthereumSpoolBalanceFetcher,
    EthereumSpoolVaultContractPositionFetcher,
    SpoolAppDefinition,
    SpoolContractFactory,
  ],
})
export class SpoolAppModule extends AbstractApp() {}
