import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IndexCoopContractFactory } from './contracts';
import { EthereumIndexCoopFarmContractPositionFetcher } from './ethereum/index-coop.farm.contract-position-fetcher';
import { EthereumIndexCoopIndexTokenFetcher } from './ethereum/index-coop.index.token-fetcher';
import { IndexCoopAppDefinition, INDEX_COOP_DEFINITION } from './index-coop.definition';

@Register.AppModule({
  appId: INDEX_COOP_DEFINITION.id,
  providers: [
    IndexCoopAppDefinition,
    IndexCoopContractFactory,
    EthereumIndexCoopIndexTokenFetcher,
    EthereumIndexCoopFarmContractPositionFetcher,
  ],
})
export class IndexCoopAppModule extends AbstractApp() {}
