import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumRigoblockPoolTokenFetcher } from './arbitrum/rigoblock.pool.token-fetcher';
import { RigoblockLogProvider } from './common/rigoblock.log-provider';
import { RigoblockContractFactory } from './contracts';
import { EthereumRigoblockPoolTokenFetcher } from './ethereum/rigoblock.pool.token-fetcher';
import { OptimismRigoblockPoolTokenFetcher } from './optimism/rigoblock.pool.token-fetcher';
import { PolygonRigoblockPoolTokenFetcher } from './polygon/rigoblock.pool.token-fetcher';

@Module({
  providers: [
    RigoblockContractFactory,
    RigoblockLogProvider,
    ArbitrumRigoblockPoolTokenFetcher,
    EthereumRigoblockPoolTokenFetcher,
    OptimismRigoblockPoolTokenFetcher,
    PolygonRigoblockPoolTokenFetcher,
  ],
})
export class RigoblockAppModule extends AbstractApp() {}
