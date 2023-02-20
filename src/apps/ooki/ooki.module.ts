import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumOokiLendTokenFetcher } from './arbitrum/ooki.lend.token-fetcher';
import { BinanceSmartChainOokiLendTokenFetcher } from './binance-smart-chain/ooki.lend.token-fetcher';
import { OokiContractFactory } from './contracts';
import { EthereumOokiLendTokenFetcher } from './ethereum/ooki.lend.token-fetcher';
import { OptimismOokiLendTokenFetcher } from './optimism/ooki.lend.token-fetcher';
import { PolygonOokiLendTokenFetcher } from './polygon/ooki.lend.token-fetcher';

@Module({
  providers: [
    ArbitrumOokiLendTokenFetcher,
    BinanceSmartChainOokiLendTokenFetcher,
    EthereumOokiLendTokenFetcher,
    OptimismOokiLendTokenFetcher,
    PolygonOokiLendTokenFetcher,

    OokiContractFactory,
  ],
})
export class OokiAppModule extends AbstractApp() {}
