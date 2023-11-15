import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EnzymeFinanceViemContractFactory } from './contracts';
import { EthereumEnzymeFinanceVaultTokenFetcher } from './ethereum/enzyme-finance.vault.token-fetcher';

@Module({
  providers: [EnzymeFinanceViemContractFactory, EthereumEnzymeFinanceVaultTokenFetcher],
})
export class EnzymeFinanceAppModule extends AbstractApp() {}
