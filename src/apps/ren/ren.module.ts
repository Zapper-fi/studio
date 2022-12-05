import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RenApiClient } from './common/ren.api.client';
import { RenContractFactory } from './contracts';
import { EthereumRenDarknodeContractPositionFetcher } from './ethereum/ren.darknode.contract-position-fetcher';
import { RenModuleAppDefinition, REN_DEFINITION } from './ren.definition';

@Register.AppModule({
  appId: REN_DEFINITION.id,
  providers: [RenModuleAppDefinition, RenContractFactory, RenApiClient, EthereumRenDarknodeContractPositionFetcher],
})
export class RenAppModule extends AbstractApp() {}
