import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CoslendContractFactory } from './contracts';
import { CoslendAppDefinition, COSLEND_DEFINITION } from './coslend.definition';
import { EvmosCoslendBalanceFetcher } from './evmos/coslend.balance-fetcher';
import { EvmosCoslendBorrowContractPositionFetcher } from './evmos/coslend.borrow.contract-position-fetcher';
import { EvmosCoslendSupplyTokenFetcher } from './evmos/coslend.supply.token-fetcher';
import { CoslendBorrowBalanceHelper } from './helper/coslend.borrow.balance-helper';
import { CoslendBorrowContractPositionHelper } from './helper/coslend.borrow.contract-position-helper';
import { CoslendLendingMetaHelper } from './helper/coslend.lending.meta-helper';
import { CoslendSupplyBalanceHelper } from './helper/coslend.supply.balance-helper';
import { CoslendSupplyTokenHelper } from './helper/coslend.supply.token-helper';
import { CoslendTvlHelper } from './helper/coslend.tvl-helper';

@Register.AppModule({
  appId: COSLEND_DEFINITION.id,
  providers: [
    CoslendAppDefinition,
    CoslendContractFactory,
    EvmosCoslendBalanceFetcher,
    EvmosCoslendBorrowContractPositionFetcher,
    EvmosCoslendSupplyTokenFetcher,
    // Helpers
    CoslendLendingMetaHelper,
    CoslendSupplyTokenHelper,
    CoslendSupplyBalanceHelper,
    CoslendBorrowContractPositionHelper,
    CoslendBorrowBalanceHelper,
    CoslendTvlHelper,
  ],
  exports: [
    CoslendLendingMetaHelper,
    CoslendSupplyTokenHelper,
    CoslendSupplyBalanceHelper,
    CoslendBorrowContractPositionHelper,
    CoslendBorrowBalanceHelper,
    CoslendTvlHelper,
  ],
})
export class CoslendAppModule extends AbstractApp() {}
