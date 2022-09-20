import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheMarketXyzBorrowContractPositionFetcher } from './avalanche/market-xyz.borrow.contract-position-fetcher';
import { AvalancheMarketXyzPositionPresenter } from './avalanche/market-xyz.position-presenter';
import { AvalancheMarketXyzSupplyTokenFetcher } from './avalanche/market-xyz.supply.token-fetcher';
import { MarketXyzContractFactory } from './contracts';
import { FantomMarketXyzBorrowContractPositionFetcher } from './fantom/market-xyz.borrow.contract-position-fetcher';
import { FantomMarketXyzPositionPresenter } from './fantom/market-xyz.position-presenter';
import { FantomMarketXyzSupplyTokenFetcher } from './fantom/market-xyz.supply.token-fetcher';
import { MarketXyzAppDefinition, MARKET_XYZ_DEFINITION } from './market-xyz.definition';
import { PolygonMarketXyzBorrowContractPositionFetcher } from './polygon/market-xyz.borrow.contract-position-fetcher';
import { PolygonMarketXyzPositionPresenter } from './polygon/market-xyz.position-presenter';
import { PolygonMarketXyzSupplyTokenFetcher } from './polygon/market-xyz.supply.token-fetcher';

@Register.AppModule({
  appId: MARKET_XYZ_DEFINITION.id,
  providers: [
    MarketXyzAppDefinition,
    MarketXyzContractFactory,
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
