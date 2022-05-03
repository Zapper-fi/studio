import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { DfxContractFactory } from './contracts';
import { DfxAppDefinition } from './dfx.definition';
import { EthereumDfxCurveTokenFetcher } from './ethereum/dfx.amm.token-fetcher';
import { EthereumDfxBalanceFetcher } from './ethereum/dfx.balance-fetcher';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxCurveTokenFetcher } from './polygon/dfx.amm.token-fetcher';
import { PolygonDfxBalanceFetcher } from './polygon/dfx.balance-fetcher';
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
