import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBadgerClaimableContractPositionFetcher } from './arbitrum/badger.claimable.contract-position-fetcher';
import { ArbitrumBadgerVaultTokenFetcher } from './arbitrum/badger.vault.token-fetcher';
import { BadgerClaimableRewardsResolver } from './common/badger.claimable.rewards-resolver';
import { BadgerVaultTokenDefinitionsResolver } from './common/badger.vault.token-definition-resolver';
import { BadgerViemContractFactory } from './contracts';
import { EthereumBadgerClaimableContractPositionFetcher } from './ethereum/badger.claimable.contract-position-fetcher';
import { EthereumBadgerVaultTokenFetcher } from './ethereum/badger.vault.token-fetcher';
import { PolygonBadgerClaimableContractPositionFetcher } from './polygon/badger.claimable.contract-position-fetcher';
import { PolygonBadgerVaultTokenFetcher } from './polygon/badger.vault.token-fetcher';

@Module({
  providers: [
    BadgerViemContractFactory,
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
