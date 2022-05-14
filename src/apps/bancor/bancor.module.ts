import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BancorAppDefinition, BANCOR_DEFINITION } from './bancor.definition';
import { BancorContractFactory } from './contracts';
import { EthereumBancorBalanceFetcher } from './ethereum/bancor.balance-fetcher';
import { EthereumBancorV3ContractPositionFetcher } from './ethereum/bancor.v3.contract-position-fetcher';

@Register.AppModule({
  appId: BANCOR_DEFINITION.id,
  providers: [
    BancorAppDefinition,
    BancorContractFactory,
    EthereumBancorBalanceFetcher,
    EthereumBancorV3ContractPositionFetcher,
  ],
})
export class BancorAppModule extends AbstractApp() {}
