import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { MuxLevTradesBalanceHelper } from '~apps/mux/helpers/mux.lev-trades.balance-helper';
import { MuxLevTradesContractPositionHelper } from '~apps/mux/helpers/mux.lev-trades.contract-position-helper';
import { MuxMlpTokenHelper } from '~apps/mux/helpers/mux.mlp.token-helper';

import { ArbitrumMuxBalanceFetcher } from './arbitrum/mux.balance-fetcher';
import { ArbitrumMuxFarmContractPositionFetcher } from './arbitrum/mux.farm.contract-position-fetcher';
import { ArbitrumMuxMlpTokenFetcher } from './arbitrum/mux.mlp.token-fetcher';
import { ArbitrumMuxMuxTokenFetcher } from './arbitrum/mux.mux.token-fetcher';
import { ArbitrumMuxPerpContractPositionFetcher } from './arbitrum/mux.perp.contract-position-fetcher';
import { AvalancheMuxBalanceFetcher } from './avalanche/mux.balance-fetcher';
import { AvalancheMuxLevTradesContractPositionFetcher } from './avalanche/mux.lev-trades.contract-position-fetcher';
import { AvalancheMuxMlpTokenFetcher } from './avalanche/mux.mlp.token-fetcher';
import { BinanceSmartChainMuxBalanceFetcher } from './binance-smart-chain/mux.balance-fetcher';
import { BinanceSmartChainMuxLevTradesContractPositionFetcher } from './binance-smart-chain/mux.lev-trades.contract-position-fetcher';
import { BinanceSmartChainMuxMlpTokenFetcher } from './binance-smart-chain/mux.mlp.token-fetcher';
import { MuxContractFactory } from './contracts';
import { FantomMuxBalanceFetcher } from './fantom/mux.balance-fetcher';
import { FantomMuxLevTradesContractPositionFetcher } from './fantom/mux.lev-trades.contract-position-fetcher';
import { FantomMuxMlpTokenFetcher } from './fantom/mux.mlp.token-fetcher';
import { MuxAppDefinition, MUX_DEFINITION } from './mux.definition';

@Register.AppModule({
  appId: MUX_DEFINITION.id,
  providers: [
    MuxAppDefinition,
    MuxContractFactory,
    // Helper
    MuxLevTradesBalanceHelper,
    MuxMlpTokenHelper,
    MuxLevTradesContractPositionHelper,
    // Arbitrum
    ArbitrumMuxBalanceFetcher,
    ArbitrumMuxFarmContractPositionFetcher,
    ArbitrumMuxPerpContractPositionFetcher,
    ArbitrumMuxMlpTokenFetcher,
    ArbitrumMuxMuxTokenFetcher,
    // Avalanche
    AvalancheMuxBalanceFetcher,
    AvalancheMuxLevTradesContractPositionFetcher,
    AvalancheMuxMlpTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainMuxBalanceFetcher,
    BinanceSmartChainMuxLevTradesContractPositionFetcher,
    BinanceSmartChainMuxMlpTokenFetcher,
    // Fantom
    FantomMuxBalanceFetcher,
    FantomMuxLevTradesContractPositionFetcher,
    FantomMuxMlpTokenFetcher,
  ],
})
export class MuxAppModule extends AbstractApp() {}
