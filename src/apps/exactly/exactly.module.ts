import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ExactlyDefinitionsResolver } from './common/exactly.definitions-resolver';
import { ExactlyContractFactory } from './contracts';
import { EthereumExactlyBorrowFetcher } from './ethereum/exactly.borrow.token-fetcher';
import { EthereumExactlyDepositFetcher } from './ethereum/exactly.deposit.token-fetcher';
import { EthereumExactlyFixedBorrowFetcher } from './ethereum/exactly.fixed-borrow.token-fetcher';
import { EthereumExactlyFixedDepositFetcher } from './ethereum/exactly.fixed-deposit.token-fetcher';
import { EthereumExactlyPositionPresenter } from './ethereum/exactly.position-presenter';
import { OptimismExactlyBorrowFetcher } from './optimism/exactly.borrow.token-fetcher';
import { OptimismExactlyDepositFetcher } from './optimism/exactly.deposit.token-fetcher';
import { OptimismExactlyFixedBorrowFetcher } from './optimism/exactly.fixed-borrow.token-fetcher';
import { OptimismExactlyFixedDepositFetcher } from './optimism/exactly.fixed-deposit.token-fetcher';
import { OptimismExactlyPositionPresenter } from './optimism/exactly.position-presenter';
import { OptimismExactlyRewardsFetcher } from './optimism/exactly.rewards.contract-position-fetcher';

@Module({
  providers: [
    ExactlyContractFactory,
    ExactlyDefinitionsResolver,
    EthereumExactlyPositionPresenter,
    EthereumExactlyBorrowFetcher,
    EthereumExactlyDepositFetcher,
    EthereumExactlyFixedBorrowFetcher,
    EthereumExactlyFixedDepositFetcher,
    OptimismExactlyPositionPresenter,
    OptimismExactlyBorrowFetcher,
    OptimismExactlyDepositFetcher,
    OptimismExactlyFixedBorrowFetcher,
    OptimismExactlyFixedDepositFetcher,
    OptimismExactlyRewardsFetcher,
  ],
})
export class ExactlyAppModule extends AbstractApp() {}
