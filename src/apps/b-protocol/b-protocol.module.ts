import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound/compound.module';

import { BProtocolContractFactory } from './contracts';
import { BProtocolCompoundSupplyTokenFetcher } from './ethereum/b-protocol.compound-supply.token-fetcher';

import { BProtocolAppDefinition, B_PROTOCOL_DEFINITION } from '.';

@Register.AppModule({
  appId: B_PROTOCOL_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    BProtocolAppDefinition,
    BProtocolContractFactory,
    BProtocolCompoundSupplyTokenFetcher,
    // CompoundBProtocolAdapter,
    // LiquityBProtocolAdapter,
    // MakerBProtocolAdapter,
    // EthereumBProtocolBalanceFetcher,
  ],
})
export class BProtocolAppModule extends AbstractApp() {}
