import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { NaosContractFactory } from './contracts';
import { EthereumNaosFarmContractPositionFetcher } from './ethereum/naos.farm.contract-position-fetcher';
import { NaosAppDefinition, NAOS_DEFINITION } from './naos.definition';

@Register.AppModule({
  appId: NAOS_DEFINITION.id,
  providers: [NaosAppDefinition, NaosContractFactory, EthereumNaosFarmContractPositionFetcher],
  exports: [NaosContractFactory],
})
export class NaosAppModule extends AbstractApp() {}
