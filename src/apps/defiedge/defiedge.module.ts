import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDefiedgeStrategyTokenFetcher } from './arbitrum/defiedge.strategy.token-fetcher';
import { BaseDefiedgeStrategyTokenFetcher } from './base/defiedge.strategy.token-fetcher';
import { BinanceSmartChainDefiedgeStrategyTokenFetcher } from './binance-smart-chain/defiedge.strategy.token-fetcher';
import { DefiedgeStrategyDefinitionsResolver } from './common/defiedge.strategy.definitions-resolver';
import { DefiedgeViemContractFactory } from './contracts';
import { EthereumDefiedgeStrategyTokenFetcher } from './ethereum/defiedge.strategy.token-fetcher';
import { OptimismDefiedgeStrategyTokenFetcher } from './optimism/defiedge.strategy.token-fetcher';
import { PolygonDefiedgeStrategyTokenFetcher } from './polygon/defiedge.strategy.token-fetcher';

@Module({
  providers: [
    DefiedgeViemContractFactory,
    DefiedgeStrategyDefinitionsResolver,
    ArbitrumDefiedgeStrategyTokenFetcher,
    BaseDefiedgeStrategyTokenFetcher,
    EthereumDefiedgeStrategyTokenFetcher,
    BinanceSmartChainDefiedgeStrategyTokenFetcher,
    OptimismDefiedgeStrategyTokenFetcher,
    PolygonDefiedgeStrategyTokenFetcher,
  ],
})
export class DefiedgeAppModule extends AbstractApp() {}
