import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolContractFactory } from './contracts';
import { OptimismPikaProtocolVaultContractPositionFetcher } from './optimism/pika-protocol.vault.contract-position-fetcher';
import { PikaProtocolAppDefinition, PIKA_PROTOCOL_DEFINITION } from './pika-protocol.definition';

@Register.AppModule({
  appId: PIKA_PROTOCOL_DEFINITION.id,
  providers: [PikaProtocolAppDefinition, PikaProtocolContractFactory, OptimismPikaProtocolVaultContractPositionFetcher],
})
export class PikaProtocolAppModule extends AbstractApp() {}
