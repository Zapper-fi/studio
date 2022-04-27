import { Module } from '@nestjs/common';

import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2/uniswap-v2.module';

import { BananoAppDefinition } from './banano.definition';
import { BinanceSmartChainBananoBalanceFetcher } from './binance-smart-chain/banano.balance-fetcher';
import { BinanceSmartChainBananoFarmContractPositionFetcher } from './binance-smart-chain/banano.farm.contract-position-fetcher';
import { BananoContractFactory } from './contracts';
import { FantomBananoBalanceFetcher } from './fantom/banano.balance-fetcher';
import { FantomBananoFarmContractPositionFetcher } from './fantom/banano.farm.contract-position-fetcher';
import { BananoFarmBalanceFetcherHelper } from './helpers/banano.farm.balance-fetcher-helper';
import { BananoFarmContractPositionFetcherHelper } from './helpers/banano.farm.contract-position-fetcher-helper';
import { PolygonBananoBalanceFetcher } from './polygon/banano.balance-fetcher';
import { PolygonBananoFarmContractPositionFetcher } from './polygon/banano.farm.contract-position-fetcher';

@Module({
  imports: ExternalAppImport(UniswapV2AppModule),
  providers: [
    BananoAppDefinition,
    BananoContractFactory,
    BananoFarmContractPositionFetcherHelper,
    BananoFarmBalanceFetcherHelper,
    // BSC
    BinanceSmartChainBananoBalanceFetcher,
    BinanceSmartChainBananoFarmContractPositionFetcher,
    // Polygon
    PolygonBananoBalanceFetcher,
    PolygonBananoFarmContractPositionFetcher,
    // Fantom
    FantomBananoBalanceFetcher,
    FantomBananoFarmContractPositionFetcher,
  ],
})
export class BananoAppModule extends AbstractApp() {}
