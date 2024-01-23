import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MaplePoolDefinitionResolver } from './common/maple.pool.definition-resolver';
import { MapleViemContractFactory } from './contracts';
import { EthereumMaplePendingWithdrawalContractPositionFetcher } from './ethereum/maple.pending-withdrawal.contract-position-fetcher';
import { EthereumMaplePoolTokenFetcher } from './ethereum/maple.pool.token-fetcher';

@Module({
  providers: [
    MapleViemContractFactory,
    MaplePoolDefinitionResolver,
    EthereumMaplePoolTokenFetcher,
    EthereumMaplePendingWithdrawalContractPositionFetcher,
  ],
})
export class MapleAppModule extends AbstractApp() {}
