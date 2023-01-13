import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainWombatExchangePoolTokenFetcher } from './binance-smart-chain/wombat-exchange.pool.token-fetcher';
import { WombatExchangeContractFactory } from './contracts';
import { WombatExchangeAppDefinition } from './wombat-exchange.definition';

@Module({
  providers: [BinanceSmartChainWombatExchangePoolTokenFetcher, WombatExchangeContractFactory],
})
export class WombatExchangeAppModule extends AbstractApp() {}
