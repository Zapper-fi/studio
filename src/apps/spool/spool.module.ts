import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumSpoolStakingContractPositionFetcher } from '~apps/spool/ethereum/spool.staking.contract-position-fetcher';

import { SpoolContractFactory } from './contracts';
import { EthereumSpoolBalanceFetcher } from './ethereum/spool.balance-fetcher';
import { EthereumSpoolVaultContractPositionFetcher } from './ethereum/spool.vault.contract-position-fetcher';
import { SpoolAppDefinition, SPOOL_DEFINITION } from './spool.definition';

@Register.AppModule({
  appId: SPOOL_DEFINITION.id,
  providers: [
    EthereumSpoolBalanceFetcher,
    EthereumSpoolVaultContractPositionFetcher,
    EthereumSpoolStakingContractPositionFetcher,
    SpoolAppDefinition,
    SpoolContractFactory,
  ],
})
export class SpoolAppModule extends AbstractApp() {}
