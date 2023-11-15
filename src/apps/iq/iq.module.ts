import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IqViemContractFactory } from './contracts';
import { EthereumIqHiiqContractPositionFetcher } from './ethereum/iq.hiiq.contract-position-fetcher';

@Module({
  providers: [EthereumIqHiiqContractPositionFetcher, IqViemContractFactory],
})
export class IqAppModule extends AbstractApp() {}
