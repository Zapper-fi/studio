import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KeeperDaoContractFactory } from './contracts';
import { EthereumKeeperDaoBalanceFetcher } from './ethereum/keeper-dao.balance-fetcher';
import { EthereumKeeperDaoV2PoolTokenFetcher } from './ethereum/keeper-dao.pool-v2.token-fetcher';
import { EthereumKeeperDaoV3PoolTokenFetcher } from './ethereum/keeper-dao.pool-v3.token-fetcher';
import { KeeperDaoAppDefinition, KEEPER_DAO_DEFINITION } from './keeper-dao.definition';

@Register.AppModule({
  appId: KEEPER_DAO_DEFINITION.id,
  providers: [
    KeeperDaoAppDefinition,
    KeeperDaoContractFactory,
    EthereumKeeperDaoV2PoolTokenFetcher,
    EthereumKeeperDaoV3PoolTokenFetcher,
    EthereumKeeperDaoBalanceFetcher,
  ],
})
export class KeeperDaoAppModule extends AbstractApp() {}
