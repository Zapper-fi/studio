import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DfxViemContractFactory } from './contracts';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxStakingContractPositionFetcher } from './polygon/dfx.staking.contract-position-fetcher';

@Module({
  providers: [
    DfxViemContractFactory,
    // Ethereum
    EthereumDfxStakingContractPositionFetcher,
    // Polygon
    PolygonDfxStakingContractPositionFetcher,
  ],
})
export class DfxAppModule extends AbstractApp() {}
