import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2AppModule } from '~apps/aave-v2';

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
  imports: [AaveV2AppModule],
  providers: [
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
