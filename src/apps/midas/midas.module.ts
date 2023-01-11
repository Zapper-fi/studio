import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainMidasMarketTokenFetcher } from './binance-smart-chain/midas.market.token-fetcher';
import { MidasContractFactory } from './contracts';
import { EvmosMidasMarketTokenFetcher } from './evmos/midas.market.token-fetcher';
import { MidasAppDefinition, MIDAS_DEFINITION } from './midas.definition';
import { PolygonMidasMarketTokenFetcher } from './polygon/midas.market.token-fetcher';

@Register.AppModule({
  appId: MIDAS_DEFINITION.id,
  providers: [
    BinanceSmartChainMidasMarketTokenFetcher,
    EvmosMidasMarketTokenFetcher,
    MidasAppDefinition,
    MidasContractFactory,
    PolygonMidasMarketTokenFetcher,
  ],
})
export class MidasAppModule extends AbstractApp() {}
