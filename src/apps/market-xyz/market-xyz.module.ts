import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheMarketXyzBorrowContractPositionFetcher } from './avalanche/market-xyz.borrow.contract-position-fetcher';
import { AvalancheMarketXyzPositionPresenter } from './avalanche/market-xyz.position-presenter';
import { AvalancheMarketXyzSupplyTokenFetcher } from './avalanche/market-xyz.supply.token-fetcher';
import { MarketXyzViemContractFactory } from './contracts';
import { FantomMarketXyzBorrowContractPositionFetcher } from './fantom/market-xyz.borrow.contract-position-fetcher';
import { FantomMarketXyzPositionPresenter } from './fantom/market-xyz.position-presenter';
import { FantomMarketXyzSupplyTokenFetcher } from './fantom/market-xyz.supply.token-fetcher';
import { PolygonMarketXyzBorrowContractPositionFetcher } from './polygon/market-xyz.borrow.contract-position-fetcher';
import { PolygonMarketXyzPositionPresenter } from './polygon/market-xyz.position-presenter';
import { PolygonMarketXyzSupplyTokenFetcher } from './polygon/market-xyz.supply.token-fetcher';

@Module({
  providers: [
    MarketXyzViemContractFactory,
    // Avalanche
    AvalancheMarketXyzBorrowContractPositionFetcher,
    AvalancheMarketXyzPositionPresenter,
    AvalancheMarketXyzSupplyTokenFetcher,
    // Fantom
    FantomMarketXyzBorrowContractPositionFetcher,
    FantomMarketXyzPositionPresenter,
    FantomMarketXyzSupplyTokenFetcher,
    // Polygon
    PolygonMarketXyzBorrowContractPositionFetcher,
    PolygonMarketXyzPositionPresenter,
    PolygonMarketXyzSupplyTokenFetcher,
  ],
})
export class MarketXyzAppModule extends AbstractApp() {}
