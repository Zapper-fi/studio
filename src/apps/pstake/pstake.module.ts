import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainPstakeStakeTokenFetcher } from './binance-smart-chain/pstake.Stake.token-fetcher';
import { PstakeContractFactory } from './contracts';
import { PstakeAppDefinition, PSTAKE_DEFINITION } from './pstake.definition';

@Register.AppModule({
  appId: PSTAKE_DEFINITION.id,
  providers: [BinanceSmartChainPstakeStakeTokenFetcher, PstakeAppDefinition, PstakeContractFactory],
})
export class PstakeAppModule extends AbstractApp() {}
