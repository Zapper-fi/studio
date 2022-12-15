import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PendleV2ContractFactory } from './contracts';
import { EthereumPendleV2PoolTokenFetcher } from './ethereum/pendle-v2.pool.token-fetcher';
import { EthereumPendleV2PrincipalTokenTokenFetcher } from './ethereum/pendle-v2.principal-token.token-fetcher';
import { EthereumPendleV2YieldTokenTokenFetcher } from './ethereum/pendle-v2.yield-token.token-fetcher';
import { PendleV2AppDefinition, PENDLE_V_2_DEFINITION } from './pendle-v2.definition';

@Register.AppModule({
  appId: PENDLE_V_2_DEFINITION.id,
  providers: [
    EthereumPendleV2PoolTokenFetcher,
    EthereumPendleV2PrincipalTokenTokenFetcher,
    EthereumPendleV2YieldTokenTokenFetcher,
    PendleV2AppDefinition,
    PendleV2ContractFactory,
  ],
})
export class PendleV2AppModule extends AbstractApp() {}
