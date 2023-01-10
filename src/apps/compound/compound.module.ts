import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundAppDefinition } from './compound.definition';
import { CompoundContractFactory } from './contracts';
import { EthereumCompoundBorrowContractPositionFetcher } from './ethereum/compound.borrow.contract-position-fetcher';
import { EthereumCompoundClaimableContractPositionFetcher } from './ethereum/compound.claimable.contract-position-fetcher';
import { EthereumCompoundPositionPresenter } from './ethereum/compound.position-presenter';
import { EthereumCompoundSupplyTokenFetcher } from './ethereum/compound.supply.token-fetcher';

@Module({
  providers: [
    CompoundAppDefinition,
    CompoundContractFactory,
    EthereumCompoundBorrowContractPositionFetcher,
    EthereumCompoundPositionPresenter,
    EthereumCompoundClaimableContractPositionFetcher,
    EthereumCompoundSupplyTokenFetcher,
  ],
})
export class CompoundAppModule extends AbstractApp() {}
