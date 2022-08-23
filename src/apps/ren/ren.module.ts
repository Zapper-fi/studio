import { Register } from '~app-toolkit/decorators';

import { RenApiClient } from './common/ren.api.client';
import { EthereumRenDarknodeContractPositionFetcher } from './ethereum/ren.darknode.contract-position-fetcher';
import { RenModuleAppDefinition, REN_DEFINITION } from './ren.definition';

@Register.AppModule({
  appId: REN_DEFINITION.id,
  providers: [RenModuleAppDefinition, RenApiClient, EthereumRenDarknodeContractPositionFetcher],
})
export class RenAppModule {}
