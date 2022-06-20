import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSushiSwapBentoBoxBalanceFetcher } from './arbitrum/sushiswap-bentobox.balance-fetcher';
import { ArbitrumSushiSwapBentoBoxContractPositionFetcher } from './arbitrum/sushiswap-bentobox.vault.contract-position-fetcher';
import { BscSushiSwapBentoBoxBalanceFetcher } from './binance-smart-chain/sushiswap-bentobox.balance-fetcher';
import { BscSushiSwapBentoBoxContractPositionFetcher } from './binance-smart-chain/sushiswap-bentobox.vault.contract-position-fetcher';
import { SushiswapBentoboxContractFactory } from './contracts';
import { EthereumSushiSwapBentoBoxBalanceFetcher } from './ethereum/sushiswap-bentobox.balance-fetcher';
import { EthereumSushiSwapBentoBoxContractPositionFetcher } from './ethereum/sushiswap-bentobox.vault.contract-position-fetcher';
import { SushiSwapBentoBoxContractPositionBalanceHelper } from './helpers/sushiswap-bentobox.vault.contract-position-balance-helper';
import { SushiSwapBentoBoxContractPositionHelper } from './helpers/sushiswap-bentobox.vault.contract-position-helper';
import { PolygonSushiSwapBentoBoxBalanceFetcher } from './polygon/sushiswap-bentobox.balance-fetcher';
import { PolygonSushiSwapBentoBoxContractPositionFetcher } from './polygon/sushiswap-bentobox.vault.contract-position-fetcher';
import { SushiSwapBentoBoxAppDefinition, SUSHISWAP_BENTOBOX_DEFINITION } from './sushiswap-bentobox.definition';

@Register.AppModule({
  appId: SUSHISWAP_BENTOBOX_DEFINITION.id,
  providers: [
    SushiSwapBentoBoxAppDefinition,
    SushiswapBentoboxContractFactory,
    SushiSwapBentoBoxContractPositionBalanceHelper,
    SushiSwapBentoBoxContractPositionHelper,
    // Arbitrum
    ArbitrumSushiSwapBentoBoxContractPositionFetcher,
    ArbitrumSushiSwapBentoBoxBalanceFetcher,
    // Binance Smart Chain
    BscSushiSwapBentoBoxContractPositionFetcher,
    BscSushiSwapBentoBoxBalanceFetcher,
    // Ethereum
    EthereumSushiSwapBentoBoxContractPositionFetcher,
    EthereumSushiSwapBentoBoxBalanceFetcher,
    // Polygon
    PolygonSushiSwapBentoBoxContractPositionFetcher,
    PolygonSushiSwapBentoBoxBalanceFetcher,
  ],
})
export class SushiSwapBentoBoxAppModule extends AbstractApp() {}
