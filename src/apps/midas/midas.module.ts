import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainMidasMarketTokenFetcher } from './binance-smart-chain/midas.market.token-fetcher';
import { MidasContractFactory } from './contracts';
import { EvmosMidasMarketTokenFetcher } from './evmos/midas.market.token-fetcher';
import { PolygonMidasMarketTokenFetcher } from './polygon/midas.market.token-fetcher';

@Module({
  providers: [
    BinanceSmartChainMidasMarketTokenFetcher,
    EvmosMidasMarketTokenFetcher,

    MidasContractFactory,
    PolygonMidasMarketTokenFetcher,
  ],
})
export class MidasAppModule extends AbstractApp() {}
