import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ExactlyContractFactory } from './contracts';
import { EthereumExactlyBalanceFetcher } from './ethereum/exactly.balance-fetcher';
import { EthereumExactlyBorrowTokenFetcher } from './ethereum/exactly.borrow.token-fetcher';
import { EthereumExactlyDepositTokenFetcher } from './ethereum/exactly.deposit.token-fetcher';
import { EthereumExactlyFixedBorrowTokenFetcher } from './ethereum/exactly.fixed-borrow.token-fetcher';
import { EthereumExactlyFixedDepositTokenFetcher } from './ethereum/exactly.fixed-deposit.token-fetcher';
import { ExactlyAppDefinition, EXACTLY_DEFINITION } from './exactly.definition';

@Register.AppModule({
  appId: EXACTLY_DEFINITION.id,
  providers: [
    EthereumExactlyBalanceFetcher,
    EthereumExactlyBorrowTokenFetcher,
    EthereumExactlyDepositTokenFetcher,
    EthereumExactlyFixedDepositTokenFetcher,
    EthereumExactlyFixedBorrowTokenFetcher,
    ExactlyAppDefinition,
    ExactlyContractFactory,
  ],
})
export class ExactlyAppModule extends AbstractApp() {}
