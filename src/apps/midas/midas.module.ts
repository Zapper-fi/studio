import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainMidasPoolTokenFetcher } from './binance-smart-chain/midas.pool.token-fetcher';
import { BinanceSmartChainMidasPoolTokenFetcher } from './binance-smart-chain/midas.pool.token-fetcher';
import { MidasContractFactory } from './contracts';
import { MidasAppDefinition, MIDAS_DEFINITION } from './midas.definition';

@Register.AppModule({
  appId: MIDAS_DEFINITION.id,
  providers: [
    BinanceSmartChainMidasPoolTokenFetcher,
    BinanceSmartChainMidasPoolTokenFetcher,
    MidasAppDefinition,
    MidasContractFactory,
  ],
})
export class MidasAppModule extends AbstractApp() {}
