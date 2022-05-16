import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheMarketXyzBalanceFetcher } from './avalanche/market-xyz.balance-fetcher';
import { AvalancheMarketXyzPoolContractPositionFetcher } from './avalanche/market-xyz.pool.contract-position-fetcher';
import { MarketXyzContractFactory } from './contracts';
import { FantomMarketXyzBalanceFetcher } from './fantom/market-xyz.balance-fetcher';
import { FantomMarketXyzPoolContractPositionFetcher } from './fantom/market-xyz.pool.contract-position-fetcher';
import { FantomMarketXyzTvlFetcher } from './fantom/market-xyz.tvl-fetcher';
import { MarketXyzAppDefinition, MARKET_XYZ_DEFINITION } from './market-xyz.definition';
import { PolygonMarketXyzBalanceFetcher } from './polygon/market-xyz.balance-fetcher';
import { PolygonMarketXyzPoolContractPositionFetcher } from './polygon/market-xyz.pool.contract-position-fetcher';

@Register.AppModule({
  appId: MARKET_XYZ_DEFINITION.id,
  providers: [
    AvalancheMarketXyzBalanceFetcher,
    AvalancheMarketXyzPoolContractPositionFetcher,
    FantomMarketXyzBalanceFetcher,
    FantomMarketXyzPoolContractPositionFetcher,
    FantomMarketXyzTvlFetcher,
    MarketXyzAppDefinition,
    MarketXyzContractFactory,
    PolygonMarketXyzBalanceFetcher,
    PolygonMarketXyzPoolContractPositionFetcher,
  ],
})
export class MarketXyzAppModule extends AbstractApp() {}
