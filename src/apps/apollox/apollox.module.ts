import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainApolloxAlpStakingContractPositionFetcher } from './binance-smart-chain/apollox.alp-stacking.contract-position-fetcher';
import { BinanceSmartChainApolloxAlpContractPositionFetcher } from './binance-smart-chain/apollox.alp.contract-position-fetcher';
import { ApolloxContractFactory } from './contracts';

@Module({
  providers: [
    ApolloxContractFactory,
    BinanceSmartChainApolloxAlpContractPositionFetcher,
    BinanceSmartChainApolloxAlpStakingContractPositionFetcher,
  ],
})
export class ApolloxAppModule extends AbstractApp() { }
