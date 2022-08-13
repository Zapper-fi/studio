import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MetavaultTradeContractFactory } from './contracts';
import { MvxEsMvxTokenHelper } from './helpers/mvx.es-mvx.token-helper';
import { MvxMvlpTokenHelper } from './helpers/mvx.mvlp.token-helper';
import { MetavaultTradeAppDefinition, METAVAULT_TRADE_DEFINITION } from './metavault-trade.definition';
import { PolygonMetavaultTradeBalanceFetcher } from './polygon/metavault-trade.balance-fetcher';
import { PolygonMetavaultTradeEsMvxTokenFetcher } from './polygon/metavault-trade.es-mvx.token-fetcher';
import { PolygonMetavaultTradeFarmContractPositionFetcher } from './polygon/metavault-trade.farm.contract-position-fetcher';
import { PolygonMetavaultTradeMvlpTokenFetcher } from './polygon/metavault-trade.mvlp.token-fetcher';

@Register.AppModule({
  appId: METAVAULT_TRADE_DEFINITION.id,
  providers: [
    MetavaultTradeAppDefinition,
    MetavaultTradeContractFactory,
    MvxEsMvxTokenHelper,
    MvxMvlpTokenHelper,

    PolygonMetavaultTradeBalanceFetcher,
    PolygonMetavaultTradeEsMvxTokenFetcher,
    PolygonMetavaultTradeFarmContractPositionFetcher,
    PolygonMetavaultTradeMvlpTokenFetcher,
  ],
})
export class MetavaultTradeAppModule extends AbstractApp() {}
