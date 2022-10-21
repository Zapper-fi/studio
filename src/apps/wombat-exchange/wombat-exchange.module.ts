import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainWombatExchangePoolTokenFetcher } from './binance-smart-chain/wombat-exchange.pool.token-fetcher';
import { WombatExchangeContractFactory } from './contracts';
import { WombatExchangeAppDefinition, WOMBAT_EXCHANGE_DEFINITION } from './wombat-exchange.definition';

@Register.AppModule({
  appId: WOMBAT_EXCHANGE_DEFINITION.id,
  providers: [
    BinanceSmartChainWombatExchangePoolTokenFetcher,
    WombatExchangeAppDefinition,
    WombatExchangeContractFactory,
  ],
})
export class WombatExchangeAppModule extends AbstractApp() {}
