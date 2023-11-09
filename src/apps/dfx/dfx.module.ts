import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DfxViemContractFactory } from './contracts';
import { EthereumDfxCurveTokenFetcher } from './ethereum/dfx.curve.token-fetcher';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxCurveTokenFetcher } from './polygon/dfx.curve.token-fetcher';
import { PolygonDfxStakingContractPositionFetcher } from './polygon/dfx.staking.contract-position-fetcher';

@Module({
  providers: [
    DfxContractFactory,
    // Ethereum
    EthereumDfxCurveTokenFetcher,
    EthereumDfxStakingContractPositionFetcher,
    // Polygon
    PolygonDfxCurveTokenFetcher,
    PolygonDfxStakingContractPositionFetcher,
  ],
})
export class DfxAppModule extends AbstractApp() {}
