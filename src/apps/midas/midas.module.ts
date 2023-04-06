import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainMidasMarketTokenFetcher } from './binance-smart-chain/midas.market.token-fetcher';
import { MidasContractFactory } from './contracts';
import { PolygonMidasMarketTokenFetcher } from './polygon/midas.market.token-fetcher';

@Module({
  providers: [MidasContractFactory, BinanceSmartChainMidasMarketTokenFetcher, PolygonMidasMarketTokenFetcher],
})
export class MidasAppModule extends AbstractApp() {}
