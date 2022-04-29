import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { NaosContractFactory } from './contracts';
import { EthereumNaosBalanceFetcher } from './ethereum/naos.balance-fetcher';
import { EthereumNaosFarmContractPositionFetcher } from './ethereum/naos.farm.contract-position-fetcher';
import { NaosAppDefinition, NAOS_DEFINITION } from './naos.definition';

@Register.AppModule({
  appId: NAOS_DEFINITION.id,
  providers: [
    NaosAppDefinition,
    NaosContractFactory,
    EthereumNaosFarmContractPositionFetcher,
    EthereumNaosBalanceFetcher,
  ],
  exports: [NaosContractFactory],
})
export class NaosAppModule extends AbstractApp() {}
