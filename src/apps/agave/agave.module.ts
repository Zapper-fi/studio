import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { AgaveViemContractFactory } from './contracts';
import { GnosisAgaveClaimableContractPositionFetcher } from './gnosis/agave.claimable.contract-position-fetcher';
import { GnosisAgaveDepositTokenFetcher } from './gnosis/agave.deposit.token-fetcher';
import { GnosisAgavePositionPresenter } from './gnosis/agave.position-presenter';
import { GnosisAgaveStableBorrowTokenFetcher } from './gnosis/agave.stable-borrow.token-fetcher';
import { GnosisAgaveVariableBorrowTokenFetcher } from './gnosis/agave.variable-borrow.token-fetcher';

@Module({
  providers: [
    AgaveViemContractFactory,
    AaveV2ViemContractFactory,
    GnosisAgaveClaimableContractPositionFetcher,
    GnosisAgaveDepositTokenFetcher,
    GnosisAgavePositionPresenter,
    GnosisAgaveStableBorrowTokenFetcher,
    GnosisAgaveVariableBorrowTokenFetcher,
  ],
})
export class AgaveAppModule extends AbstractApp() {}
