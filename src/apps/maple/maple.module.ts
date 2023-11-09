import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MaplePoolDefinitionResolver } from './common/maple.pool.definition-resolver';
import { MapleViemContractFactory } from './contracts';
import { EthereumMaplePendingWithdrawalContractPositionFetcher } from './ethereum/maple.pending-withdrawal.contract-position-fetcher';
import { EthereumMaplePoolTokenFetcher } from './ethereum/maple.pool.token-fetcher';
import { EthereumMapleXMplTokenFetcher } from './ethereum/maple.x-mpl.token-fetcher';

@Module({
  providers: [
    MapleViemContractFactory,
    MaplePoolDefinitionResolver,
    EthereumMaplePoolTokenFetcher,
    EthereumMapleXMplTokenFetcher,
    EthereumMaplePendingWithdrawalContractPositionFetcher,
  ],
})
export class MapleAppModule extends AbstractApp() {}
