import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { DfxContractFactory } from './contracts';
import { DfxAppDefinition } from './dfx.definition';
import { EthereumDfxBalanceFetcher } from './ethereum/dfx.balance-fetcher';
import { EthereumDfxCurveTokenFetcher } from './ethereum/dfx.curve.token-fetcher';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxBalanceFetcher } from './polygon/dfx.balance-fetcher';
import { PolygonDfxCurveTokenFetcher } from './polygon/dfx.curve.token-fetcher';
import { PolygonDfxStakingContractPositionFetcher } from './polygon/dfx.staking.contract-position-fetcher';

@Module({
  providers: [
    DfxAppDefinition,
    DfxContractFactory,
    EthereumDfxBalanceFetcher,
    EthereumDfxCurveTokenFetcher,
    EthereumDfxStakingContractPositionFetcher,
    PolygonDfxBalanceFetcher,
    PolygonDfxCurveTokenFetcher,
    PolygonDfxStakingContractPositionFetcher,
  ],
})
export class DfxAppModule extends AbstractDynamicApp<DfxAppModule>() {}
