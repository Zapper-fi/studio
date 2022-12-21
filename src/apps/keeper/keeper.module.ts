import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KeeperContractFactory } from './contracts';
import { EthereumKeeperJobContractPositionFetcher } from './ethereum/keeper.job.contract-position-fetcher';
import { EthereumKeeperKlpTokenFetcher } from './ethereum/keeper.klp.token-fetcher';
import { KeeperAppDefinition, KEEPER_DEFINITION } from './keeper.definition';

@Register.AppModule({
  appId: KEEPER_DEFINITION.id,
  providers: [
    EthereumKeeperJobContractPositionFetcher,
    EthereumKeeperKlpTokenFetcher,
    KeeperAppDefinition,
    KeeperContractFactory,
  ],
})
export class KeeperAppModule extends AbstractApp() { }
