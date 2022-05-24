import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BancorV3AppDefinition, BANCOR_V3_DEFINITION } from './bancor-v3.definition';
import { BancorV3ContractFactory } from './contracts';
import { EthereumBancorV3BalanceFetcher } from './ethereum/bancor-v3.balance-fetcher';
import { EthereumBancorV3ContractPositionFetcher } from './ethereum/bancor-v3.farm.contract-position-fetcher';
import { EthereumBancorV3TokenFetcher } from './ethereum/bancor-v3.pool.token-fetcher';

@Register.AppModule({
  appId: BANCOR_V3_DEFINITION.id,
  providers: [
    BancorV3AppDefinition,
    BancorV3ContractFactory,
    EthereumBancorV3BalanceFetcher,
    EthereumBancorV3ContractPositionFetcher,
    EthereumBancorV3TokenFetcher,
  ],
})
export class BancorV3AppModule extends AbstractApp() {}
