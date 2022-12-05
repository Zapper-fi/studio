import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBeefyBoostVaultContractPositionFetcher } from './arbitrum/beefy.boost-vault.contract-position-fetcher';
import { ArbitrumBeefyVaultTokenFetcher } from './arbitrum/beefy.vault.token-fetcher';
import { AvalancheBeefyBoostVaultContractPositionFetcher } from './avalanche/beefy.boost-vault.contract-position-fetcher';
import { AvalancheBeefyVaultTokenFetcher } from './avalanche/beefy.vault.token-fetcher';
import { BeefyAppDefinition, BEEFY_DEFINITION } from './beefy.definition';
import { BinanceSmartChainBeefyBoostVaultContractPositionFetcher } from './binance-smart-chain/beefy.boost-vault.contract-position-fetcher';
import { BinanceSmartChainBeefyVaultTokenFetcher } from './binance-smart-chain/beefy.vault.token-fetcher';
import { BeefyBoostVaultDefinitionsResolver } from './common/beefy.boost-vault.definition-resolver';
import { BeefyVaultTokenDefinitionsResolver } from './common/beefy.vault.token-definition-resolver';
import { BeefyContractFactory } from './contracts';
import { FantomBeefyBoostVaultContractPositionFetcher } from './fantom/beefy.boost-vault.contract-position-fetcher';
import { FantomBeefyVaultTokenFetcher } from './fantom/beefy.vault.token-fetcher';
import { OptimismBeefyBoostVaultContractPositionFetcher } from './optimism/beefy.boost-vault.contract-position-fetcher';
import { OptimismBeefyVaultTokenFetcher } from './optimism/beefy.vault.token-fetcher';
import { PolygonBeefyBoostVaultContractPositionFetcher } from './polygon/beefy.boost-vault.contract-position-fetcher';
import { PolygonBeefyVaultTokenFetcher } from './polygon/beefy.vault.token-fetcher';

@Register.AppModule({
  appId: BEEFY_DEFINITION.id,
  providers: [
    BeefyAppDefinition,
    BeefyContractFactory,
    // Helpers
    BeefyVaultTokenDefinitionsResolver,
    BeefyBoostVaultDefinitionsResolver,
    // Polygon
    PolygonBeefyVaultTokenFetcher,
    PolygonBeefyBoostVaultContractPositionFetcher,
    // Fantom
    FantomBeefyVaultTokenFetcher,
    FantomBeefyBoostVaultContractPositionFetcher,
    // Binance Smart Chain
    BinanceSmartChainBeefyVaultTokenFetcher,
    BinanceSmartChainBeefyBoostVaultContractPositionFetcher,
    // Avalanche
    AvalancheBeefyVaultTokenFetcher,
    AvalancheBeefyBoostVaultContractPositionFetcher,
    // Arbitrum
    ArbitrumBeefyVaultTokenFetcher,
    ArbitrumBeefyBoostVaultContractPositionFetcher,
    // Optimism
    OptimismBeefyVaultTokenFetcher,
    OptimismBeefyBoostVaultContractPositionFetcher,
  ],
  exports: [BeefyAppDefinition, BeefyContractFactory],
})
export class BeefyAppModule extends AbstractApp() {}
