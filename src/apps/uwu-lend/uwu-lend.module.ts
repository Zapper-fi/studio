import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UwuLendContractFactory } from './contracts';
import { EthereumUwuLendSupplyTokenFetcher } from './ethereum/uwu-lend.supply.token-fetcher';
import { EthereumUwuLendVariableDebtTokenFetcher } from './ethereum/uwu-lend.variable-debt.token-fetcher';
import { UwuLendAppDefinition } from './uwu-lend.definition';

@Module({
  providers: [
    UwuLendAppDefinition,
    UwuLendContractFactory,
    EthereumUwuLendSupplyTokenFetcher,
    EthereumUwuLendVariableDebtTokenFetcher,
  ],
})
export class UwuLendAppModule extends AbstractApp() {}
