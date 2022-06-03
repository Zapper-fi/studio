import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolContractFactory } from './contracts';
import { PikaProtocolAppDefinition, PIKA_PROTOCOL_DEFINITION } from './pika-protocol.definition';

@Register.AppModule({
  appId: PIKA_PROTOCOL_DEFINITION.id,
  providers: [PikaProtocolAppDefinition, PikaProtocolContractFactory],
})
export class PikaProtocolAppModule extends AbstractApp() {}
