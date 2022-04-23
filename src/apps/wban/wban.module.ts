import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2/uniswap-v2.module';

import { WbanAppDefinition } from './wban.definition';
import { WbanContractFactory } from './contracts';
import { WbanFarmContractPositionFetcherHelper } from './helpers/wban.farm.contract-position-fetcher-helper';
import { WbanFarmBalanceFetcherHelper } from './helpers/wban.farm.balance-fetcher-helper';
import { BinanceSmartChainWbanBalanceFetcher } from './binance-smart-chain/wban.balance-fetcher';
import { BinanceSmartChainWbanFarmContractPositionFetcher } from './binance-smart-chain/wban.farm.contract-position-fetcher';
import { PolygonWbanBalanceFetcher } from './polygon/wban.balance-fetcher';
import { PolygonWbanFarmContractPositionFetcher } from './polygon/wban.farm.contract-position-fetcher';
import { FantomWbanBalanceFetcher } from './fantom/wban.balance-fetcher';
import { FantomWbanFarmContractPositionFetcher } from './fantom/wban.farm.contract-position-fetcher';

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
