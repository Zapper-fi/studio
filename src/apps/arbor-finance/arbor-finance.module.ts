import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArborFinanceAppDefinition } from './arbor-finance.definition';
import { ArborFinanceContractFactory } from './contracts';
import { EthereumArborFinanceBondTokenFetcher } from './ethereum/arbor-finance.bond.token-fetcher';

@Module({
  providers: [ArborFinanceAppDefinition, ArborFinanceContractFactory, EthereumArborFinanceBondTokenFetcher],
})
export class ArborFinanceAppModule extends AbstractApp() {}
