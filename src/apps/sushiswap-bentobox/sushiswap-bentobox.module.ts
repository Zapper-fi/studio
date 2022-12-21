import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSushiSwapBentoBoxContractPositionFetcher } from './arbitrum/sushiswap-bentobox.vault.contract-position-fetcher';
import { AvalancheSushiSwapBentoBoxContractPositionFetcher } from './avalanche/sushiswap-bentobox.vault.contract-position-fetcher';
import { BinanceSmartChainSushiSwapBentoBoxContractPositionFetcher } from './binance-smart-chain/sushiswap-bentobox.vault.contract-position-fetcher';
import { SushiswapBentoboxVaultTokensResolver } from './common/sushiswap-bentobox.vault-tokens-resolver';
import { SushiswapBentoboxContractFactory } from './contracts';
import { EthereumSushiSwapBentoBoxContractPositionFetcher } from './ethereum/sushiswap-bentobox.vault.contract-position-fetcher';
import { FantomSushiSwapBentoBoxContractPositionFetcher } from './fantom/sushiswap-bentobox.vault.contract-position-fetcher';
import { PolygonSushiSwapBentoBoxContractPositionFetcher } from './polygon/sushiswap-bentobox.vault.contract-position-fetcher';
import { SushiSwapBentoBoxAppDefinition, SUSHISWAP_BENTOBOX_DEFINITION } from './sushiswap-bentobox.definition';

@Register.AppModule({
  appId: SUSHISWAP_BENTOBOX_DEFINITION.id,
  providers: [
    SushiSwapBentoBoxAppDefinition,
    SushiswapBentoboxContractFactory,
    SushiswapBentoboxVaultTokensResolver,
    // Arbitrum
    ArbitrumSushiSwapBentoBoxContractPositionFetcher,
    // Avalanche
    AvalancheSushiSwapBentoBoxContractPositionFetcher,
    // Binance Smart Chain
    BinanceSmartChainSushiSwapBentoBoxContractPositionFetcher,
    // Ethereum
    EthereumSushiSwapBentoBoxContractPositionFetcher,
    // Fantom
    FantomSushiSwapBentoBoxContractPositionFetcher,
    // Polygon
    PolygonSushiSwapBentoBoxContractPositionFetcher,
  ],
})
export class SushiSwapBentoBoxAppModule extends AbstractApp() {}
