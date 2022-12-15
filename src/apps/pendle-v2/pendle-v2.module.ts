import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PendleV2ContractFactory } from './contracts';
import { EthereumPendleV2FarmTokenFetcher } from './ethereum/pendle-v2.farm.token-fetcher';
import { EthereumPendleV2YieldTokenTokenFetcher } from './ethereum/pendle-v2.yield-token.token-fetcher';
import { PendleV2AppDefinition, PENDLE_V_2_DEFINITION } from './pendle-v2.definition';

@Register.AppModule({
  appId: PENDLE_V_2_DEFINITION.id,
  providers: [
    EthereumPendleV2FarmTokenFetcher,
    EthereumPendleV2YieldTokenTokenFetcher,
    PendleV2AppDefinition,
    PendleV2ContractFactory,
  ],
})
export class PendleV2AppModule extends AbstractApp() { }
