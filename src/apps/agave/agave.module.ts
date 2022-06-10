import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';
import { AaveV2ClaimableBalanceHelper } from '~apps/aave-v2/helpers/aave-v2.claimable.balance-helper';
import { AaveV2ClaimableContractPositionHelper } from '~apps/aave-v2/helpers/aave-v2.claimable.contract-position-helper';
import { AaveV2HealthFactorMetaHelper } from '~apps/aave-v2/helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from '~apps/aave-v2/helpers/aave-v2.lending.balance-helper';
import { AaveV2LendingTokenHelper } from '~apps/aave-v2/helpers/aave-v2.lending.token-helper';

import { AgaveAppDefinition, AGAVE_DEFINITION } from './agave.definition';
import { AgaveContractFactory } from './contracts';
import { GnosisAgaveBalanceFetcher } from './gnosis/agave.balance-fetcher';
import { GnosisAgaveClaimableContractPositionFetcher } from './gnosis/agave.claimable.contract-position-fetcher';
import { GnosisAgaveDepositTokenFetcher } from './gnosis/agave.deposit.token-fetcher';
import { GnosisAgaveStableBorrowTokenFetcher } from './gnosis/agave.stable-borrow.token-fetcher';
import { GnosisAgaveTvlFetcher } from './gnosis/agave.tvl-fetcher';
import { GnosisAgaveVariableBorrowTokenFetcher } from './gnosis/agave.variable-borrow.token-fetcher';

@Register.AppModule({
  appId: AGAVE_DEFINITION.id,
  providers: [
    AaveV2ClaimableBalanceHelper,
    AaveV2ClaimableContractPositionHelper,
    AaveV2ContractFactory,
    AaveV2HealthFactorMetaHelper,
    AaveV2LendingBalanceHelper,
    AaveV2LendingTokenHelper,
    AgaveAppDefinition,
    AgaveContractFactory,
    GnosisAgaveBalanceFetcher,
    GnosisAgaveClaimableContractPositionFetcher,
    GnosisAgaveDepositTokenFetcher,
    GnosisAgaveStableBorrowTokenFetcher,
    GnosisAgaveTvlFetcher,
    GnosisAgaveVariableBorrowTokenFetcher,
  ],
})
export class AgaveAppModule extends AbstractApp() {}
