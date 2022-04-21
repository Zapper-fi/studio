import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { MgnoContractFactory } from './contracts';
import { GnosisMgnoBalanceFetcher } from './gnosis/mgno.balance-fetcher';
import { GnosisMgnoLiquidstakingContractPositionFetcher } from './gnosis/mgno.liquidstaking.contract-position-fetcher';
import { GnosisMgnoLiquidstakingrewardContractPositionFetcher } from './gnosis/mgno.liquidstakingreward.contract-position-fetcher';
import { GnosisMgnoLockedContractPositionFetcher } from './gnosis/mgno.locked.contract-position-fetcher';
import { GnosisMgnoStakingContractPositionFetcher } from './gnosis/mgno.staking.contract-position-fetcher';
import { GnosisMgnoTokenTokenFetcher } from './gnosis/mgno.token.token-fetcher';
import { MgnoAppDefinition } from './mgno.definition';

@Module({
  providers: [
    MgnoAppDefinition,
    MgnoContractFactory,
    GnosisMgnoBalanceFetcher,
    GnosisMgnoTokenTokenFetcher,
    GnosisMgnoStakingContractPositionFetcher,
    GnosisMgnoLockedContractPositionFetcher,
    GnosisMgnoLiquidstakingContractPositionFetcher,
    GnosisMgnoLiquidstakingrewardContractPositionFetcher,
  ],
})
export class MgnoAppModule extends AbstractDynamicApp<MgnoAppModule>() {}
