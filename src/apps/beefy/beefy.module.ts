import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBeefyBoostVaultContractPositionFetcher } from './arbitrum/beefy.boost-vault.contract-position-fetcher';
import { ArbitrumBeefyVaultTokenFetcher } from './arbitrum/beefy.vault.token-fetcher';
import { AvalancheBeefyBoostVaultContractPositionFetcher } from './avalanche/beefy.boost-vault.contract-position-fetcher';
import { AvalancheBeefyVaultTokenFetcher } from './avalanche/beefy.vault.token-fetcher';
import { BinanceSmartChainBeefyBoostVaultContractPositionFetcher } from './binance-smart-chain/beefy.boost-vault.contract-position-fetcher';
import { BinanceSmartChainBeefyVaultTokenFetcher } from './binance-smart-chain/beefy.vault.token-fetcher';
import { BeefyBoostVaultDefinitionsResolver } from './common/beefy.boost-vault.definition-resolver';
import { BeefyVaultTokenDefinitionsResolver } from './common/beefy.vault.token-definition-resolver';
import { BeefyContractFactory } from './contracts';
import { EthereumBeefyVaultTokenFetcher } from './ethereum/beefy.vault.token-fetcher';
import { FantomBeefyBoostVaultContractPositionFetcher } from './fantom/beefy.boost-vault.contract-position-fetcher';
import { FantomBeefyVaultTokenFetcher } from './fantom/beefy.vault.token-fetcher';
import { MoonriverBeefyVaultTokenFetcher } from './moonriver/beefy.vault.token-fetcher';
import { OptimismBeefyBoostVaultContractPositionFetcher } from './optimism/beefy.boost-vault.contract-position-fetcher';
import { OptimismBeefyVaultTokenFetcher } from './optimism/beefy.vault.token-fetcher';
import { PolygonBeefyBoostVaultContractPositionFetcher } from './polygon/beefy.boost-vault.contract-position-fetcher';
import { PolygonBeefyVaultTokenFetcher } from './polygon/beefy.vault.token-fetcher';

@Module({
  providers: [
    BeefyContractFactory,
    // Helpers
    BeefyVaultTokenDefinitionsResolver,
    BeefyBoostVaultDefinitionsResolver,
    // Arbitrum
    ArbitrumBeefyVaultTokenFetcher,
    ArbitrumBeefyBoostVaultContractPositionFetcher,
    // Avalanche
    AvalancheBeefyVaultTokenFetcher,
    AvalancheBeefyBoostVaultContractPositionFetcher,
    // Binance Smart Chain
    BinanceSmartChainBeefyVaultTokenFetcher,
    BinanceSmartChainBeefyBoostVaultContractPositionFetcher,
    // Ethereum
    EthereumBeefyVaultTokenFetcher,
    // Fantom
    FantomBeefyVaultTokenFetcher,
    FantomBeefyBoostVaultContractPositionFetcher,
    // Moonriver
    MoonriverBeefyVaultTokenFetcher,
    // Optimism
    OptimismBeefyVaultTokenFetcher,
    OptimismBeefyBoostVaultContractPositionFetcher,
    // Polygon
    PolygonBeefyVaultTokenFetcher,
    PolygonBeefyBoostVaultContractPositionFetcher,
  ],
})
export class BeefyAppModule extends AbstractApp() {}
