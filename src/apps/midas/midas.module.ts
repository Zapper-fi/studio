import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMidasPoolTokenFetcher } from './arbitrum/midas.pool.token-fetcher';
import { BinanceSmartChainMidasPoolTokenFetcher } from './binance-smart-chain/midas.pool.token-fetcher';
import { MidasContractFactory } from './contracts';
import { MidasPoolTokenHelper } from './helpers/midas.pool.token-helper';
import { MidasAppDefinition, MIDAS_DEFINITION } from './midas.definition';
import { MoonriverMidasPoolTokenFetcher } from './moonriver/midas.pool.token-fetcher';
import { PolygonMidasPoolTokenFetcher } from './polygon/midas.pool.token-fetcher';

@Register.AppModule({
  appId: MIDAS_DEFINITION.id,
  providers: [
    ArbitrumMidasPoolTokenFetcher,
    BinanceSmartChainMidasPoolTokenFetcher,
    MidasAppDefinition,
    MidasContractFactory,
    MoonriverMidasPoolTokenFetcher,
    PolygonMidasPoolTokenFetcher,
    // Helpers
    MidasPoolTokenHelper,
  ],
  exports: [MidasPoolTokenHelper],
})
export class MidasAppModule extends AbstractApp() {}
