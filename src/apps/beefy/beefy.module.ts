import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBeefyBalanceFetcher } from './arbitrum/beefy.arbitrum.balance-fetcher';
import { ArbitrumBeefyVaultTokenFetcher } from './arbitrum/beefy.arbitrum.vault-token-fetcher';
import { AvalancheBeefyBalanceFetcher } from './avalanche/beefy.avalanche.balance-fetcher';
import { AvalancheBeefyVaultTokenFetcher } from './avalanche/beefy.avalanche.vault-token-fetcher';
import { BeefyAppDefinition, BEEFY_DEFINITION } from './beefy.definition';
import { BinanceSmartChainBeefyBalanceFetcher } from './binance-smart-chain/beefy.bsc.balance-fetcher';
import { BinanceSmartChainBeefyVaultTokenFetcher } from './binance-smart-chain/beefy.bsc.vault-token-fetcher';
import { BeefyContractFactory } from './contracts';
import { FantomBeefyBalanceFetcher } from './fantom/beefy.fantom.balance-fetcher';
import { FantomBeefyVaultTokenFetcher } from './fantom/beefy.fantom.vault-token-fetcher';
import { BeefyVaultTokensHelper } from './helpers/beefy.vault-token-fetcher-helper';
import { OptimismBeefyBalanceFetcher } from './optimism/beefy.optimism.balance-fetcher';
import { OptimismBeefyVaultTokenFetcher } from './optimism/beefy.optimism.vault-token-fetcher';
import { PolygonBeefyBalanceFetcher } from './polygon/beefy.polygon.balance-fetcher';
import { PolygonBeefyVaultTokenFetcher } from './polygon/beefy.vault.token-fetcher';

@Register.AppModule({
  appId: BEEFY_DEFINITION.id,
  providers: [
    BeefyAppDefinition,
    BeefyContractFactory,
    // Helpers
    BeefyVaultTokensHelper,
    // Polygon
    PolygonBeefyBalanceFetcher,
    PolygonBeefyVaultTokenFetcher,
    // Fantom
    FantomBeefyBalanceFetcher,
    FantomBeefyVaultTokenFetcher,
    // Binance Smart Chain
    BinanceSmartChainBeefyBalanceFetcher,
    BinanceSmartChainBeefyVaultTokenFetcher,
    // Avalanche
    AvalancheBeefyBalanceFetcher,
    AvalancheBeefyVaultTokenFetcher,
    // Arbitrum
    ArbitrumBeefyBalanceFetcher,
    ArbitrumBeefyVaultTokenFetcher,
    // Optimism
    OptimismBeefyBalanceFetcher,
    OptimismBeefyVaultTokenFetcher,
  ],
  exports: [BeefyAppDefinition, BeefyContractFactory],
})
export class BeefyAppModule extends AbstractApp() {}
