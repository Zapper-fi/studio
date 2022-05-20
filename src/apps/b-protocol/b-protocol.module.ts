import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound/compound.module';

import { CompoundBProtocolAdapter } from './adapters/compound.b-protocol-adapter';
import { LiquityBProtocolAdapter } from './adapters/liquity.b-protocol-adapter';
import { MakerBProtocolAdapter } from './adapters/maker.b-protocol.adapter';
import { BProtocolContractFactory } from './contracts';
import { EthereumBProtocolBalanceFetcher } from './ethereum/b-protocol.balance-fetcher';

import { BProtocolAppDefinition, B_PROTOCOL_DEFINITION } from '.';

@Register.AppModule({
  appId: B_PROTOCOL_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    BProtocolAppDefinition,
    BProtocolContractFactory,
    CompoundBProtocolAdapter,
    LiquityBProtocolAdapter,
    MakerBProtocolAdapter,
    EthereumBProtocolBalanceFetcher,
  ],
})
export class BProtocolAppModule extends AbstractApp() {}
