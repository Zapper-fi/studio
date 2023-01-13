import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';

import { AgaveAppDefinition } from './agave.definition';
import { AgaveContractFactory } from './contracts';
import { GnosisAgaveClaimableContractPositionFetcher } from './gnosis/agave.claimable.contract-position-fetcher';
import { GnosisAgaveDepositTokenFetcher } from './gnosis/agave.deposit.token-fetcher';
import { GnosisAgavePositionPresenter } from './gnosis/agave.position-presenter';
import { GnosisAgaveStableBorrowTokenFetcher } from './gnosis/agave.stable-borrow.token-fetcher';
import { GnosisAgaveVariableBorrowTokenFetcher } from './gnosis/agave.variable-borrow.token-fetcher';

@Module({
  providers: [
    AgaveContractFactory,
    AaveV2ContractFactory,
    GnosisAgaveClaimableContractPositionFetcher,
    GnosisAgaveDepositTokenFetcher,
    GnosisAgavePositionPresenter,
    GnosisAgaveStableBorrowTokenFetcher,
    GnosisAgaveVariableBorrowTokenFetcher,
  ],
})
export class AgaveAppModule extends AbstractApp() {}
