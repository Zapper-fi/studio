import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainHelioStakingContractPositionFetcher } from './binance-smart-chain/helio.staking.contract-position-fetcher';
import { HelioContractFactory } from './contracts';
import { HelioAppDefinition, HELIO_DEFINITION } from './helio.definition';

@Register.AppModule({
  appId: HELIO_DEFINITION.id,
  providers: [HelioAppDefinition, HelioContractFactory, BinanceSmartChainHelioStakingContractPositionFetcher],
})
export class HelioAppModule extends AbstractApp() {}
