import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBadgerClaimableContractPositionFetcher } from './arbitrum/badger.claimable.contract-position-fetcher';
import { ArbitrumBadgerVaultTokenFetcher } from './arbitrum/badger.vault.token-fetcher';
import { BadgerAppDefinition, BADGER_DEFINITION } from './badger.definition';
import { BadgerClaimableRewardsResolver } from './common/badger.claimable.rewards-resolver';
import { BadgerVaultTokenDefinitionsResolver } from './common/badger.vault.token-definition-resolver';
import { BadgerContractFactory } from './contracts';
import { EthereumBadgerClaimableContractPositionFetcher } from './ethereum/badger.claimable.contract-position-fetcher';
import { EthereumBadgerVaultTokenFetcher } from './ethereum/badger.vault.token-fetcher';
import { PolygonBadgerClaimableContractPositionFetcher } from './polygon/badger.claimable.contract-position-fetcher';
import { PolygonBadgerVaultTokenFetcher } from './polygon/badger.vault.token-fetcher';

@Register.AppModule({
  appId: BADGER_DEFINITION.id,
  providers: [
    BadgerAppDefinition,
    BadgerContractFactory,
    BadgerVaultTokenDefinitionsResolver,
    BadgerClaimableRewardsResolver,
    // Arbitrum
    ArbitrumBadgerVaultTokenFetcher,
    ArbitrumBadgerClaimableContractPositionFetcher,
    // Ethereum
    EthereumBadgerVaultTokenFetcher,
    EthereumBadgerClaimableContractPositionFetcher,
    // Polygon
    PolygonBadgerVaultTokenFetcher,
    PolygonBadgerClaimableContractPositionFetcher,
  ],
})
export class BadgerAppModule extends AbstractApp() {}
