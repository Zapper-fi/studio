import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { OptimismMuxMlpTokenFetcher } from '~apps/mux/optimism/mux.mlp.token-fetcher';
import { OptimismMuxPerpContractPositionFetcher } from '~apps/mux/optimism/mux.perp.contract-position-fetcher';

import { ArbitrumMuxFarmContractPositionFetcher } from './arbitrum/mux.farm.contract-position-fetcher';
import { ArbitrumMuxMlpTokenFetcher } from './arbitrum/mux.mlp.token-fetcher';
import { ArbitrumMuxMuxTokenFetcher } from './arbitrum/mux.mux.token-fetcher';
import { ArbitrumMuxPerpContractPositionFetcher } from './arbitrum/mux.perp.contract-position-fetcher';
import { AvalancheMuxMlpTokenFetcher } from './avalanche/mux.mlp.token-fetcher';
import { AvalancheMuxPerpContractPositionFetcher } from './avalanche/mux.perp.contract-position-fetcher';
import { BinanceSmartChainMuxMlpTokenFetcher } from './binance-smart-chain/mux.mlp.token-fetcher';
import { BinanceSmartChainMuxPerpContractPositionFetcher } from './binance-smart-chain/mux.perp.contract-position-fetcher';
import { MuxContractFactory } from './contracts';
import { FantomMuxMlpTokenFetcher } from './fantom/mux.mlp.token-fetcher';
import { FantomMuxPerpContractPositionFetcher } from './fantom/mux.perp.contract-position-fetcher';

@Module({
  providers: [
    MuxContractFactory,
    // Arbitrum
    ArbitrumMuxFarmContractPositionFetcher,
    ArbitrumMuxPerpContractPositionFetcher,
    ArbitrumMuxMlpTokenFetcher,
    ArbitrumMuxMuxTokenFetcher,
    // Avalanche
    AvalancheMuxPerpContractPositionFetcher,
    AvalancheMuxMlpTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainMuxPerpContractPositionFetcher,
    BinanceSmartChainMuxMlpTokenFetcher,
    // Fantom
    FantomMuxPerpContractPositionFetcher,
    FantomMuxMlpTokenFetcher,
    // Optimism
    OptimismMuxMlpTokenFetcher,
    OptimismMuxPerpContractPositionFetcher,
  ],
})
export class MuxAppModule extends AbstractApp() {}
