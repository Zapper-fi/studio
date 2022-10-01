import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CleverAppDefinition, CLEVER_DEFINITION } from './clever.definition';
import { CleverContractFactory } from './contracts';
import { EthereumCleverLeverTokenFetcher } from './ethereum/clever.lever.token-fetcher';
import { EthereumCleverFurnaceContractPositionFetcher } from './ethereum/clever.furnace.contract-position-fetcher';
import { EthereumCleverLockContractPositionFetcher } from './ethereum/clever.lock.contract-position-fetcher';

@Register.AppModule({
  appId: CLEVER_DEFINITION.id,
  providers: [
    CleverAppDefinition,
    CleverContractFactory,
    EthereumCleverLeverTokenFetcher,
    EthereumCleverFurnaceContractPositionFetcher,
    EthereumCleverLockContractPositionFetcher,
  ],
})
export class CleverAppModule extends AbstractApp() { }
