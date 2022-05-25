import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { YieldProtocolContractFactory } from './contracts';
import { EthereumYieldProtocolLendTokenFetcher } from './ethereum/yield-protocol.lend.token-fetcher';
import { YieldProtocolAppDefinition, YIELD_PROTOCOL_DEFINITION } from './yield-protocol.definition';

@Register.AppModule({
  appId: YIELD_PROTOCOL_DEFINITION.id,
  providers: [EthereumYieldProtocolLendTokenFetcher, YieldProtocolAppDefinition, YieldProtocolContractFactory],
})
export class YieldProtocolAppModule extends AbstractApp() {}
