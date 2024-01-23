import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MetavaultTradeViemContractFactory } from './contracts';
import { PolygonMetavaultTradeFarmContractPositionFetcher } from './polygon/metavault-trade.farm.contract-position-fetcher';
import { PolygonMetavaultTradeMvlpTokenFetcher } from './polygon/metavault-trade.mvlp.token-fetcher';
import { PolygonPerpContractPositionFetcher } from './polygon/metavault-trade.perp.contract-position-fetcher';

@Module({
  providers: [
    MetavaultTradeViemContractFactory,
    //Polygon
    PolygonMetavaultTradeFarmContractPositionFetcher,
    PolygonMetavaultTradeMvlpTokenFetcher,
    PolygonPerpContractPositionFetcher,
  ],
})
export class MetavaultTradeAppModule extends AbstractApp() {}
