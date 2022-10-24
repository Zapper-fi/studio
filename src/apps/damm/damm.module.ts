import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundContractFactory } from './contracts';
import { CompoundAppDefinition, COMPOUND_DEFINITION } from './damm.definition';
import { EthereumCompoundBorrowContractPositionFetcher } from './ethereum/damm.borrow.contract-position-fetcher';
import { EthereumCompoundClaimableContractPositionFetcher } from './ethereum/damm.claimable.contract-position-fetcher';
import { EthereumCompoundPositionPresenter } from './ethereum/damm.position-presenter';
import { EthereumCompoundSupplyTokenFetcher } from './ethereum/damm.supply.token-fetcher';
import { CompoundBorrowBalanceHelper } from './helper/damm.borrow.balance-helper';
import { CompoundBorrowContractPositionHelper } from './helper/damm.borrow.contract-position-helper';
import { CompoundClaimableBalanceHelper } from './helper/damm.claimable.balance-helper';
import { CompoundClaimableContractPositionHelper } from './helper/damm.claimable.contract-position-helper';
import { CompoundLendingMetaHelper } from './helper/damm.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from './helper/damm.supply.balance-helper';
import { CompoundSupplyTokenHelper } from './helper/damm.supply.token-helper';

@Register.AppModule({
  appId: COMPOUND_DEFINITION.id,
  providers: [
    CompoundAppDefinition,
    CompoundContractFactory,
    EthereumCompoundBorrowContractPositionFetcher,
    EthereumCompoundPositionPresenter,
    EthereumCompoundClaimableContractPositionFetcher,
    EthereumCompoundSupplyTokenFetcher,
    // Helpers
    CompoundBorrowBalanceHelper,
    CompoundBorrowContractPositionHelper,
    CompoundClaimableBalanceHelper,
    CompoundClaimableContractPositionHelper,
    CompoundContractFactory,
    CompoundLendingMetaHelper,
    CompoundSupplyBalanceHelper,
    CompoundSupplyTokenHelper,
  ],
  exports: [
    CompoundBorrowBalanceHelper,
    CompoundBorrowContractPositionHelper,
    CompoundClaimableBalanceHelper,
    CompoundClaimableContractPositionHelper,
    CompoundContractFactory,
    CompoundLendingMetaHelper,
    CompoundSupplyBalanceHelper,
    CompoundSupplyTokenHelper,
  ],
})
export class CompoundAppModule extends AbstractApp() { }
