import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainHelioStakingContractPositionFetcher } from './binance-smart-chain/helio.staking.contract-position-fetcher';
import { HelioContractFactory } from './contracts';
import { HelioAppDefinition } from './helio.definition';

@Module({
  providers: [HelioContractFactory, BinanceSmartChainHelioStakingContractPositionFetcher],
})
export class HelioAppModule extends AbstractApp() {}
