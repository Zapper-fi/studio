import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundAppDefinition, COMPOUND_DEFINITION } from './compound.definition';
import { CompoundContractFactory } from './contracts';
import { EthereumCompoundBalanceFetcher } from './ethereum/compound.balance-fetcher';
import { EthereumCompoundBorrowContractPositionFetcher } from './ethereum/compound.borrow.contract-position-fetcher';
import { EthereumCompoundSupplyTokenFetcher } from './ethereum/compound.supply.token-fetcher';
import { EthereumCompoundTvlFetcher } from './ethereum/coumpound.tvl-fetcher';
import { CompoundBorrowContractPositionHelper } from './helper/compound.borrow.contract-position-helper';
import { CompoundClaimableBalanceHelper } from './helper/compound.claimable.balance-helper';
import { CompoundLendingBalanceHelper } from './helper/compound.lending.balance-helper';
import { CompoundLendingMetaHelper } from './helper/compound.lending.meta-helper';
import { CompoundSupplyTokenHelper } from './helper/compound.supply.token-helper';
import { CompoundTvlHelper } from './helper/compound.tvl-helper';

@Register.AppModule({
  appId: COMPOUND_DEFINITION.id,
  providers: [
    CompoundAppDefinition,
    CompoundContractFactory,
    EthereumCompoundBalanceFetcher,
    EthereumCompoundSupplyTokenFetcher,
    EthereumCompoundBorrowContractPositionFetcher,
    EthereumCompoundTvlFetcher,
    // Helpers
    CompoundClaimableBalanceHelper,
    CompoundLendingBalanceHelper,
    CompoundLendingMetaHelper,
    CompoundSupplyTokenHelper,
    CompoundBorrowContractPositionHelper,
    CompoundContractFactory,
    CompoundTvlHelper,
  ],
  exports: [
    CompoundClaimableBalanceHelper,
    CompoundLendingBalanceHelper,
    CompoundLendingMetaHelper,
    CompoundSupplyTokenHelper,
    CompoundBorrowContractPositionHelper,
    CompoundContractFactory,
    CompoundTvlHelper,
  ],
})
export class CompoundAppModule extends AbstractApp() {}
