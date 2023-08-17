import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OpnxContractFactory } from './contracts';
import { EthereumOpnxVeoxTokenFetcher } from './ethereum/opnx.veox.token-fetcher';

@Module({
  providers: [EthereumOpnxVeoxTokenFetcher, OpnxContractFactory],
})
export class OpnxAppModule extends AbstractApp() {}
