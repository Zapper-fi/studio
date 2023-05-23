import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RigoblockContractFactory } from './contracts';
import { EthereumRigoblockPoolTokenFetcher } from './ethereum/rigoblock.pool.token-fetcher';

@Module({
  providers: [EthereumRigoblockPoolTokenFetcher, RigoblockContractFactory],
})
export class RigoblockAppModule extends AbstractApp() {}
