import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KeeperDaoContractFactory } from './contracts';
import { EthereumKeeperDaoBalanceFetcher } from './ethereum/keeper-dao.balance-fetcher';
import { EthereumKeeperDaoV2PoolTokenFetcher } from './ethereum/keeper-dao.pool-v2.token-fetcher';
import { EthereumKeeperDaoV3PoolTokenFetcher } from './ethereum/keeper-dao.pool-v3.token-fetcher';
import { KeeperDaoAppDefinition } from './keeper-dao.definition';

@Module({
  providers: [
    KeeperDaoAppDefinition,
    KeeperDaoContractFactory,
    EthereumKeeperDaoV2PoolTokenFetcher,
    EthereumKeeperDaoV3PoolTokenFetcher,
    EthereumKeeperDaoBalanceFetcher,
  ],
})
export class KeeperDaoAppModule extends AbstractApp() {}
