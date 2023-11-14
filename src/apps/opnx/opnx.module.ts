import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OpnxViemContractFactory } from './contracts';
import { EthereumOpnxContractPositionFetcher } from './ethereum/opnx.veox.contract-position-fetcher';

@Module({
  providers: [EthereumOpnxContractPositionFetcher, OpnxViemContractFactory],
})
export class OpnxAppModule extends AbstractApp() {}
