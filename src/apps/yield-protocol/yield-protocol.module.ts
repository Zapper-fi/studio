import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { YieldProtocolContractFactory } from './contracts';
import { YieldProtocolAppDefinition, YIELD_PROTOCOL_DEFINITION } from './yield-protocol.definition';

@Register.AppModule({
  appId: YIELD_PROTOCOL_DEFINITION.id,
  providers: [YieldProtocolAppDefinition, YieldProtocolContractFactory],
})
export class YieldProtocolAppModule extends AbstractApp() {}
