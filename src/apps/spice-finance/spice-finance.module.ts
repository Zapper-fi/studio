import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SpiceFinanceContractFactory } from './contracts';
import { EthereumSpiceFinanceWethTokenFetcher } from './ethereum/spice-finance.weth.token-fetcher';

@Module({
  providers: [EthereumSpiceFinanceWethTokenFetcher, SpiceFinanceContractFactory],
})
export class SpiceFinanceAppModule extends AbstractApp() { }
