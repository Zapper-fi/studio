import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBadgerClaimableContractPositionBalanceFetcher } from './arbitrum/badger.claimable.contract-position-balance-fetcher';
import { ArbitrumBadgerClaimableContractPositionFetcher } from './arbitrum/badger.claimable.contract-position-fetcher';
import { ArbitrumBadgerVaultTokenFetcher } from './arbitrum/badger.vault.token-fetcher';
import { BadgerAppDefinition, BADGER_DEFINITION } from './badger.definition';
import { BadgerContractFactory } from './contracts';
import { EthereumBadgerClaimableContractPositionBalanceFetcher } from './ethereum/badger.claimable.contract-position-balance-fetcher';
import { EthereumBadgerClaimableContractPositionFetcher } from './ethereum/badger.claimable.contract-position-fetcher';
import { EthereumBadgerVaultTokenFetcher } from './ethereum/badger.vault.token-fetcher';
import { BadgerClaimableContractPositionBalanceHelper } from './helpers/badger.claimable.balance-helper';
import { BadgerVaultTokenHelper } from './helpers/badger.vault.token-helper';

@Register.AppModule({
  appId: BADGER_DEFINITION.id,
  providers: [
    BadgerAppDefinition,
    BadgerContractFactory,
    BadgerClaimableContractPositionBalanceHelper,
    BadgerVaultTokenHelper,
    // Arbitrum
    ArbitrumBadgerVaultTokenFetcher,
    ArbitrumBadgerClaimableContractPositionFetcher,
    ArbitrumBadgerClaimableContractPositionBalanceFetcher,
    // Ethereum
    EthereumBadgerVaultTokenFetcher,
    EthereumBadgerClaimableContractPositionFetcher,
    EthereumBadgerClaimableContractPositionBalanceFetcher,
  ],
})
export class BadgerAppModule extends AbstractApp() {}
