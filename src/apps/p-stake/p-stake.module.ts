import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainPStakeStakeTokenFetcher } from './binance-smart-chain/p-stake.stake.token-fetcher';
import { PStakeContractFactory } from './contracts';
import { PStakeAppDefinition } from './p-stake.definition';

@Module({
  providers: [BinanceSmartChainPStakeStakeTokenFetcher, PStakeAppDefinition, PStakeContractFactory],
})
export class PStakeAppModule extends AbstractApp() {}
