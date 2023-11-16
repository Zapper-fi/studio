import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SpiceFinanceViemContractFactory } from './contracts';
import { EthereumSpiceFinanceWethTokenFetcher } from './ethereum/spice-finance.weth.token-fetcher';

@Module({
  providers: [EthereumSpiceFinanceWethTokenFetcher, SpiceFinanceViemContractFactory],
})
export class SpiceFinanceAppModule extends AbstractApp() {}
