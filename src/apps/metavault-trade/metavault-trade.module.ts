import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MetavaultTradeContractFactory } from './contracts';
import { MetavaultTradeAppDefinition, METAVAULT_TRADE_DEFINITION } from './metavault-trade.definition';
import { PolygonMetavaultTradeEsMvxTokenFetcher } from './polygon/metavault-trade.es-mvx.token-fetcher';
import { PolygonMetavaultTradeFarmContractPositionFetcher } from './polygon/metavault-trade.farm.contract-position-fetcher';
import { PolygonMetavaultTradeMvlpTokenFetcher } from './polygon/metavault-trade.mvlp.token-fetcher';
import { PolygonPerpContractPositionFetcher } from './polygon/metavault-trade.perp.contract-position-fetcher';

@Register.AppModule({
  appId: METAVAULT_TRADE_DEFINITION.id,
  providers: [
    MetavaultTradeAppDefinition,
    MetavaultTradeContractFactory,
    //Polygon
    PolygonMetavaultTradeEsMvxTokenFetcher,
    PolygonMetavaultTradeFarmContractPositionFetcher,
    PolygonMetavaultTradeMvlpTokenFetcher,
    PolygonPerpContractPositionFetcher,
  ],
})
export class MetavaultTradeAppModule extends AbstractApp() {}
