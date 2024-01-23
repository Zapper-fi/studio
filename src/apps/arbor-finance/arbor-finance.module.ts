import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArborFinanceViemContractFactory } from './contracts';
import { EthereumArborFinanceBondTokenFetcher } from './ethereum/arbor-finance.bond.token-fetcher';

@Module({
  providers: [ArborFinanceViemContractFactory, EthereumArborFinanceBondTokenFetcher],
})
export class ArborFinanceAppModule extends AbstractApp() {}
