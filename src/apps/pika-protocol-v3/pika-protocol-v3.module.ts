import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PikaProtocolV3ContractFactory } from './contracts';
import { OptimismPikaProtocolV3BalanceFetcher } from './optimism/pika-protocol-v3.balance-fetcher';
import { OptimismPikaProtocolV3VaultContractPositionFetcher } from './optimism/pika-protocol-v3.vault.contract-position-fetcher';
import { PikaProtocolV3AppDefinition, PIKA_PROTOCOL_V_3_DEFINITION } from './pika-protocol-v3.definition';

@Register.AppModule({
  appId: PIKA_PROTOCOL_V_3_DEFINITION.id,
  providers: [
    OptimismPikaProtocolV3BalanceFetcher,
    OptimismPikaProtocolV3VaultContractPositionFetcher,
    PikaProtocolV3AppDefinition,
    PikaProtocolV3ContractFactory,
  ],
})
export class PikaProtocolV3AppModule extends AbstractApp() {}
