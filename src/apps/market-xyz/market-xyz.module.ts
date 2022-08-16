import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';
import { RariFuseAppModule } from '~apps/rari-fuse/rari-fuse.module';

import { AvalancheMarketXyzBalanceFetcher } from './avalanche/market-xyz.balance-fetcher';
import { AvalancheMarketXyzBorrowContractPositionFetcher } from './avalanche/market-xyz.borrow.contract-position-fetcher';
import { AvalancheMarketXyzSupplyTokenFetcher } from './avalanche/market-xyz.supply.token-fetcher';
import { MarketXyzContractFactory } from './contracts';
import { FantomMarketXyzBalanceFetcher } from './fantom/market-xyz.balance-fetcher';
import { FantomMarketXyzBorrowContractPositionFetcher } from './fantom/market-xyz.borrow.contract-position-fetcher';
import { FantomMarketXyzSupplyTokenFetcher } from './fantom/market-xyz.supply.token-fetcher';
import { MarketXyzLendingBalanceHelper } from './helpers/market-xyz.lending.balance-helper';
import { MarketXyzAppDefinition, MARKET_XYZ_DEFINITION } from './market-xyz.definition';
import { PolygonMarketXyzBalanceFetcher } from './polygon/market-xyz.balance-fetcher';
import { PolygonMarketXyzBorrowContractPositionFetcher } from './polygon/market-xyz.borrow.contract-position-fetcher';
import { PolygonMarketXyzSupplyTokenFetcher } from './polygon/market-xyz.supply.token-fetcher';

@Register.AppModule({
  appId: MARKET_XYZ_DEFINITION.id,
  imports: [CompoundAppModule, RariFuseAppModule],
  providers: [
    AvalancheMarketXyzBalanceFetcher,
    AvalancheMarketXyzBorrowContractPositionFetcher,
    AvalancheMarketXyzSupplyTokenFetcher,
    FantomMarketXyzBalanceFetcher,
    FantomMarketXyzBorrowContractPositionFetcher,
    FantomMarketXyzSupplyTokenFetcher,
    MarketXyzAppDefinition,
    MarketXyzContractFactory,
    PolygonMarketXyzBalanceFetcher,
    PolygonMarketXyzBorrowContractPositionFetcher,
    PolygonMarketXyzSupplyTokenFetcher,
    MarketXyzLendingBalanceHelper,
  ],
})
export class MarketXyzAppModule extends AbstractApp() {}
