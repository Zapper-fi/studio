import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OpnxContractFactory } from './contracts';
import { EthereumOpnxContractPositionFetcher } from './ethereum/opnx.veox.contract-position-fetcher';

@Module({
  providers: [EthereumOpnxContractPositionFetcher, OpnxContractFactory],
})
export class OpnxAppModule extends AbstractApp() { }
