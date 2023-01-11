import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainMidasMarketTokenFetcher } from './binance-smart-chain/midas.market.token-fetcher';
import { MidasContractFactory } from './contracts';
import { MidasAppDefinition } from './midas.definition';

@Module({
  providers: [BinanceSmartChainMidasMarketTokenFetcher, MidasAppDefinition, MidasContractFactory],
})
export class MidasAppModule extends AbstractApp() {}
