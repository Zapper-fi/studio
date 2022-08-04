import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundAppDefinition, COMPOUND_DEFINITION } from './compound.definition';
import { CompoundContractFactory } from './contracts';
import { EthereumCompoundBalanceFetcher } from './ethereum/compound.balance-fetcher';
import { EthereumCompoundBorrowContractPositionFetcher } from './ethereum/compound.borrow.contract-position-fetcher';
import { EthereumCompoundClaimableContractPositionFetcher } from './ethereum/compound.claimable.contract-position-fetcher';
import { EthereumCompoundSupplyTokenFetcher } from './ethereum/compound.supply.token-fetcher';
import { CompoundBorrowBalanceHelper } from './helper/compound.borrow.balance-helper';
import { CompoundBorrowContractPositionHelper } from './helper/compound.borrow.contract-position-helper';
import { CompoundClaimableBalanceHelper } from './helper/compound.claimable.balance-helper';
import { CompoundClaimableContractPositionHelper } from './helper/compound.claimable.contract-position-helper';
import { CompoundLendingMetaHelper } from './helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from './helper/compound.supply.balance-helper';
import { CompoundSupplyTokenHelper } from './helper/compound.supply.token-helper';

@Register.AppModule({
  appId: COMPOUND_DEFINITION.id,
  providers: [
    CompoundAppDefinition,
    CompoundContractFactory,
    EthereumCompoundBalanceFetcher,
    EthereumCompoundBorrowContractPositionFetcher,
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
export class CompoundAppModule extends AbstractApp() {}
