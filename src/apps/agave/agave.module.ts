import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory, AaveV2HealthFactorMetaHelper, AaveV2LendingBalanceHelper } from '~apps/aave-v2';

import { AgaveAppDefinition, AGAVE_DEFINITION } from './agave.definition';
import { AgaveContractFactory } from './contracts';
import { GnosisAgaveBalanceFetcher } from './gnosis/agave.balance-fetcher';
import { GnosisAgaveClaimableContractPositionFetcher } from './gnosis/agave.claimable.contract-position-fetcher';
import { GnosisAgaveDepositTokenFetcher } from './gnosis/agave.deposit.token-fetcher';
import { GnosisAgavePositionPresenter } from './gnosis/agave.position-presenter';
import { GnosisAgaveStableBorrowTokenFetcher } from './gnosis/agave.stable-borrow.token-fetcher';
import { GnosisAgaveVariableBorrowTokenFetcher } from './gnosis/agave.variable-borrow.token-fetcher';

@Register.AppModule({
  appId: AGAVE_DEFINITION.id,
  providers: [
    AgaveAppDefinition,
    AgaveContractFactory,
    AaveV2ContractFactory,
    AaveV2LendingBalanceHelper,
    AaveV2HealthFactorMetaHelper,
    GnosisAgaveBalanceFetcher,
    GnosisAgaveClaimableContractPositionFetcher,
    GnosisAgaveDepositTokenFetcher,
    GnosisAgavePositionPresenter,
    GnosisAgaveStableBorrowTokenFetcher,
    GnosisAgaveVariableBorrowTokenFetcher,
  ],
})
export class AgaveAppModule extends AbstractApp() {}
