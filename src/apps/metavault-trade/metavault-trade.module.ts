import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MetavaultTradeContractFactory } from './contracts';
import { MetavaultTradeEsMvxTokenHelper } from './helpers/metavault-trade.es-mvx.token-helper';
import { MetavaultTradeMvlpTokenHelper } from './helpers/metavault-trade.mvlp.token-helper';
import { MetavaultTradeOptionBalanceHelper } from './helpers/metavault-trade.option.balance-helper';
import { MetavaultTradeOptionContractPositionHelper } from './helpers/metavault-trade.option.contract-position-helper';
import { MetavaultTradeAppDefinition, METAVAULT_TRADE_DEFINITION } from './metavault-trade.definition';
import { PolygonMetavaultTradeBalanceFetcher } from './polygon/metavault-trade.balance-fetcher';
import { PolygonMetavaultTradeEsMvxTokenFetcher } from './polygon/metavault-trade.esMvx.token-fetcher';
import { PolygonMetavaultTradeFarmContractPositionFetcher } from './polygon/metavault-trade.farm.contract-position-fetcher';
import { PolygonMetavaultTradeMvlpTokenFetcher } from './polygon/metavault-trade.mvlp.token-fetcher';
import { PolygonOptionsFarmContractPositionFetcher } from './polygon/metavault-trade.option.contract-position-fetcher';

@Register.AppModule({
  appId: METAVAULT_TRADE_DEFINITION.id,
  providers: [
    MetavaultTradeAppDefinition,
    MetavaultTradeContractFactory,
    MetavaultTradeEsMvxTokenHelper,
    MetavaultTradeMvlpTokenHelper,
    MetavaultTradeOptionContractPositionHelper,
    MetavaultTradeOptionBalanceHelper,
    //Polygon
    PolygonMetavaultTradeBalanceFetcher,
    PolygonMetavaultTradeEsMvxTokenFetcher,
    PolygonMetavaultTradeFarmContractPositionFetcher,
    PolygonMetavaultTradeMvlpTokenFetcher,
    PolygonOptionsFarmContractPositionFetcher,
  ],
})
export class MetavaultTradeAppModule extends AbstractApp() {}
