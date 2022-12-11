import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ExactlyDefinitionsResolver } from './common/exactly.definitions-resolver';
import { ExactlyContractFactory } from './contracts';
import { EthereumExactlyFixedBorrowPositionFetcher } from './ethereum/exactly.borrow.fixed-position-fetcher';
import { EthereumExactlyBorrowTokenFetcher } from './ethereum/exactly.borrow.token-fetcher';
import { EthereumExactlyFixedDepositPositionFetcher } from './ethereum/exactly.deposit.fixed-position-fetcher';
import { EthereumExactlyDepositTokenFetcher } from './ethereum/exactly.deposit.token-fetcher';
import { ExactlyAppDefinition, EXACTLY_DEFINITION } from './exactly.definition';

@Register.AppModule({
  appId: EXACTLY_DEFINITION.id,
  providers: [
    ExactlyAppDefinition,
    ExactlyContractFactory,
    ExactlyDefinitionsResolver,
    EthereumExactlyBorrowTokenFetcher,
    EthereumExactlyDepositTokenFetcher,
    EthereumExactlyFixedBorrowPositionFetcher,
    EthereumExactlyFixedDepositPositionFetcher,
  ],
  exports: [ExactlyAppDefinition, ExactlyContractFactory, ExactlyDefinitionsResolver],
})
export class ExactlyAppModule extends AbstractApp() {}
