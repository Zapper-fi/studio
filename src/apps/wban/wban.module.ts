import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2/uniswap-v2.module';

import { BinanceSmartChainWbanBalanceFetcher } from './binance-smart-chain/wban.balance-fetcher';
import { BinanceSmartChainWbanFarmContractPositionFetcher } from './binance-smart-chain/wban.farm.contract-position-fetcher';
import { WbanContractFactory } from './contracts';
import { FantomWbanBalanceFetcher } from './fantom/wban.balance-fetcher';
import { FantomWbanFarmContractPositionFetcher } from './fantom/wban.farm.contract-position-fetcher';
import { WbanFarmBalanceFetcherHelper } from './helpers/wban.farm.balance-fetcher-helper';
import { WbanFarmContractPositionFetcherHelper } from './helpers/wban.farm.contract-position-fetcher-helper';
import { PolygonWbanBalanceFetcher } from './polygon/wban.balance-fetcher';
import { PolygonWbanFarmContractPositionFetcher } from './polygon/wban.farm.contract-position-fetcher';
import { WbanAppDefinition } from './wban.definition';

@Module({
  imports: [UniswapV2AppModule.externallyConfigured(UniswapV2AppModule, 0)],
  providers: [
    WbanAppDefinition,
    WbanContractFactory,
    WbanFarmContractPositionFetcherHelper,
    WbanFarmBalanceFetcherHelper,
    // BSC
    BinanceSmartChainWbanBalanceFetcher,
    BinanceSmartChainWbanFarmContractPositionFetcher,
    // Polygon
    PolygonWbanBalanceFetcher,
    PolygonWbanFarmContractPositionFetcher,
    // Fantom
    FantomWbanBalanceFetcher,
    FantomWbanFarmContractPositionFetcher,
  ],
})
export class WbanAppModule extends AbstractDynamicApp<WbanAppModule>() {}
