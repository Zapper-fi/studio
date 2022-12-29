import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ExactlyDefinitionsResolver } from './common/exactly.definitions-resolver';
import { ExactlyContractFactory } from './contracts';
import { EthereumExactlyBorrowFetcher } from './ethereum/exactly.borrow.token-fetcher';
import { EthereumExactlyDepositFetcher } from './ethereum/exactly.deposit.token-fetcher';
import { EthereumExactlyFixedBorrowFetcher } from './ethereum/exactly.fixed-borrow.token-fetcher';
import { EthereumExactlyFixedDepositFetcher } from './ethereum/exactly.fixed-deposit.token-fetcher';
import { EthereumExactlyPositionPresenter } from './ethereum/exactly.position-presenter';
import { ExactlyAppDefinition, EXACTLY_DEFINITION } from './exactly.definition';

@Register.AppModule({
  appId: EXACTLY_DEFINITION.id,
  providers: [
    ExactlyAppDefinition,
    ExactlyContractFactory,
    ExactlyDefinitionsResolver,
    EthereumExactlyPositionPresenter,
    EthereumExactlyBorrowFetcher,
    EthereumExactlyDepositFetcher,
    EthereumExactlyFixedBorrowFetcher,
    EthereumExactlyFixedDepositFetcher,
  ],
})
export class ExactlyAppModule extends AbstractApp() {}
