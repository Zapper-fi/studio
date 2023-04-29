import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainApolloxAlpContractPositionFetcher } from './binance-smart-chain/apollox.alp.contract-position-fetcher';
import { ApolloxContractFactory } from './contracts';

@Module({
  providers: [ApolloxContractFactory, BinanceSmartChainApolloxAlpContractPositionFetcher],
})
export class ApolloxAppModule extends AbstractApp() { }
