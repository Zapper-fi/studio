import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBeefyVaultTokenFetcher } from './arbitrum/beefy.vault.token-fetcher';
import { AvalancheBeefyVaultTokenFetcher } from './avalanche/beefy.vault.token-fetcher';
import { BeefyAppDefinition, BEEFY_DEFINITION } from './beefy.definition';
import { BinanceSmartChainBeefyVaultTokenFetcher } from './binance-smart-chain/beefy.vault.token-fetcher';
import { BeefyVaultTokenDefinitionsResolver } from './common/beefy.vault.token-definition-resolver';
import { BeefyContractFactory } from './contracts';
import { FantomBeefyVaultTokenFetcher } from './fantom/beefy.vault.token-fetcher';
import { OptimismBeefyVaultTokenFetcher } from './optimism/beefy.vault.token-fetcher';
import { PolygonBeefyVaultTokenFetcher } from './polygon/beefy.vault.token-fetcher';

@Register.AppModule({
  appId: BEEFY_DEFINITION.id,
  providers: [
    BeefyAppDefinition,
    BeefyContractFactory,
    // Helpers
    BeefyVaultTokenDefinitionsResolver,
    // Polygon
    PolygonBeefyVaultTokenFetcher,
    // Fantom
    FantomBeefyVaultTokenFetcher,
    // Binance Smart Chain
    BinanceSmartChainBeefyVaultTokenFetcher,
    // Avalanche
    AvalancheBeefyVaultTokenFetcher,
    // Arbitrum
    ArbitrumBeefyVaultTokenFetcher,
    // Optimism
    OptimismBeefyVaultTokenFetcher,
  ],
  exports: [BeefyAppDefinition, BeefyContractFactory],
})
export class BeefyAppModule extends AbstractApp() {}
