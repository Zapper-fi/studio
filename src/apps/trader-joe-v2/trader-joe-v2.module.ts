import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTraderJoeV2LiquidityContractPositionFetcher } from './arbitrum/trader-joe-v2.liquidity.contract-position-fetcher';
import { AvalancheTraderJoeV2LiquidityContractPositionFetcher } from './avalanche/trader-joe-v2.liquidity.contract-position-fetcher';
import { BinanceSmartChainTraderJoeV2LiquidityContractPositionFetcher } from './binance-smart-chain/trader-joe-v2.liquidity.contract-position-fetcher';
import { TraderJoeV2ContractFactory } from './contracts';

@Module({
  providers: [
    ArbitrumTraderJoeV2LiquidityContractPositionFetcher,
    AvalancheTraderJoeV2LiquidityContractPositionFetcher,
    BinanceSmartChainTraderJoeV2LiquidityContractPositionFetcher,
    TraderJoeV2ContractFactory,
  ],
})
export class TraderJoeV2AppModule extends AbstractApp() {}
