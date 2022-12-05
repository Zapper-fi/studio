import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainHelioBalanceFetcher } from './binance-smart-chain/helio.balance-fetcher';
import { BinanceSmartChainHelioStakingContractPositionFetcher } from './binance-smart-chain/helio.staking.contract-position-fetcher';
import { HelioContractFactory } from './contracts';
import { HelioAppDefinition, HELIO_DEFINITION } from './helio.definition';

@Register.AppModule({
  appId: HELIO_DEFINITION.id,
  providers: [
    BinanceSmartChainHelioBalanceFetcher,
    BinanceSmartChainHelioStakingContractPositionFetcher,
    HelioAppDefinition,
    HelioContractFactory,
  ],
})
export class HelioAppModule extends AbstractApp() {}
