import { Module } from '@nestjs/common';

import { AbstractAppHelper } from '~app/app.dynamic-module';

import { AaveV2ContractFactory } from './contracts';
import { AaveV2ClaimableBalanceHelper } from './helpers/aave-v2.claimable.balance-helper';
import { AaveV2ClaimableContractPositionHelper } from './helpers/aave-v2.claimable.contract-position-helper';
import { AaveV2HealthFactorMetaHelper } from './helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from './helpers/aave-v2.lending.balance-helper';
import { AaveV2LendingTokenHelper } from './helpers/aave-v2.lending.token-helper';

Module({
  providers: [
    AaveV2ContractFactory,
    AaveV2ClaimableBalanceHelper,
    AaveV2ClaimableContractPositionHelper,
    AaveV2HealthFactorMetaHelper,
    AaveV2LendingBalanceHelper,
    AaveV2LendingTokenHelper,
  ],
  exports: [
    AaveV2ContractFactory,
    AaveV2ClaimableBalanceHelper,
    AaveV2ClaimableContractPositionHelper,
    AaveV2HealthFactorMetaHelper,
    AaveV2LendingBalanceHelper,
    AaveV2LendingTokenHelper,
  ],
});
export class AaveV2AppHelperModule extends AbstractAppHelper() {}
