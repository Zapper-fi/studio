import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnlockdFinanceContractFactory } from './contracts';
import { EthereumUnlockdFinanceSupplyTokenFetcher } from './ethereum/unlockd-finance.supply.token-fetcher';
import { EthereumUnlockdFinanceVariableDebtTokenFetcher } from './ethereum/unlockd-finance.variable-debt.token-fetcher';

@Module({
  providers: [
    EthereumUnlockdFinanceSupplyTokenFetcher,
    EthereumUnlockdFinanceVariableDebtTokenFetcher,
    UnlockdFinanceContractFactory,
  ],
})
export class UnlockdFinanceAppModule extends AbstractApp() {}
