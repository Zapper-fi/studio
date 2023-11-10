import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainPStakeStakeTokenFetcher } from './binance-smart-chain/p-stake.stake.token-fetcher';
import { PStakeViemContractFactory } from './contracts';

@Module({
  providers: [BinanceSmartChainPStakeStakeTokenFetcher, PStakeViemContractFactory],
})
export class PStakeAppModule extends AbstractApp() {}
