import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ExactlyDefinitionsResolver } from './common/exactly.definitions-resolver';
import { ExactlyContractFactory } from './contracts';
import { EthereumExactlyBorrowTokenFetcher } from './ethereum/exactly.borrow.token-fetcher';
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
  ],
  exports: [ExactlyAppDefinition, ExactlyContractFactory, ExactlyDefinitionsResolver],
})
export class ExactlyAppModule extends AbstractApp() {}
