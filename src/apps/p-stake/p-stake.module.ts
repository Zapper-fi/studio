import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainPStakeStakeTokenFetcher } from './binance-smart-chain/p-stake.stake.token-fetcher';
import { PStakeContractFactory } from './contracts';
import { PStakeAppDefinition, P_STAKE_DEFINITION } from './p-stake.definition';

@Register.AppModule({
  appId: P_STAKE_DEFINITION.id,
  providers: [BinanceSmartChainPStakeStakeTokenFetcher, PStakeAppDefinition, PStakeContractFactory],
})
export class PStakeAppModule extends AbstractApp() {}
