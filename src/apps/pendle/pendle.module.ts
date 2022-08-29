import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PendleContractFactory } from './contracts';
import { EthereumPendleYieldTokenFetcher } from './ethereum/pendle.yield.token-fetcher';
import { PendleAppDefinition, PENDLE_DEFINITION } from './pendle.definition';

@Register.AppModule({
  appId: PENDLE_DEFINITION.id,
  providers: [PendleAppDefinition, PendleContractFactory, EthereumPendleYieldTokenFetcher],
})
export class PendleAppModule extends AbstractApp() {}
