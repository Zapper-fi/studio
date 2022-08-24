import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBeefyVaultTokenFetcher } from './arbitrum/beefy.arbitrum.vault-token-fetcher';
import { AvalancheBeefyVaultTokenFetcher } from './avalanche/beefy.avalanche.vault-token-fetcher';
import { BeefyAppDefinition, BEEFY_DEFINITION } from './beefy.definition';
import { BinanceSmartChainBeefyVaultTokenFetcher } from './binance-smart-chain/beefy.bsc.vault-token-fetcher';
import { BeefyContractFactory } from './contracts';
import { FantomBeefyVaultTokenFetcher } from './fantom/beefy.fantom.vault-token-fetcher';
import { BeefyVaultTokenDefinitionsResolver } from './helpers/beefy.vault.token-definition-resolver';
import { OptimismBeefyVaultTokenFetcher } from './optimism/beefy.optimism.vault-token-fetcher';
import { PolygonBeefyVaultTokenFetcher } from './polygon/beefy.polygon.token-fetcher';

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
