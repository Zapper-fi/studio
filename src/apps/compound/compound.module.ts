import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundAppDefinition } from './compound.definition';
import { CompoundContractFactory } from './contracts';
import { EthereumCompoundBorrowContractPositionFetcher } from './ethereum/compound.borrow.contract-position-fetcher';
import { EthereumCompoundClaimableContractPositionFetcher } from './ethereum/compound.claimable.contract-position-fetcher';
import { EthereumCompoundPositionPresenter } from './ethereum/compound.position-presenter';
import { EthereumCompoundSupplyTokenFetcher } from './ethereum/compound.supply.token-fetcher';
import { CompoundBorrowBalanceHelper } from './helper/compound.borrow.balance-helper';
import { CompoundBorrowContractPositionHelper } from './helper/compound.borrow.contract-position-helper';
import { CompoundClaimableBalanceHelper } from './helper/compound.claimable.balance-helper';
import { CompoundClaimableContractPositionHelper } from './helper/compound.claimable.contract-position-helper';
import { CompoundLendingMetaHelper } from './helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from './helper/compound.supply.balance-helper';
import { CompoundSupplyTokenHelper } from './helper/compound.supply.token-helper';

@Module({
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
export class CompoundAppModule extends AbstractApp() {}
