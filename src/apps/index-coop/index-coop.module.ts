import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { IndexCoopContractFactory } from './contracts';
import { EthereumIndexCoopBalanceFetcher } from './ethereum/index-coop.balance-fetcher';
import { EthereumIndexCoopContractPositionFetcher } from './ethereum/index-coop.farm.contract-position-fetcher';
import { EthereumIndexCoopIndexTokenFetcher } from './ethereum/index-coop.index.token-fetcher';
import { IndexCoopAppDefinition, INDEX_COOP_DEFINITION } from './index-coop.definition';

@Register.AppModule({
  appId: INDEX_COOP_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    IndexCoopAppDefinition,
    IndexCoopContractFactory,
    EthereumIndexCoopBalanceFetcher,
    EthereumIndexCoopContractPositionFetcher,
    EthereumIndexCoopIndexTokenFetcher,
  ],
})
export class IndexCoopAppModule extends AbstractApp() {}
