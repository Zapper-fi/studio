import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { IqContractFactory } from './contracts';
import { EthereumIqHiiqContractPositionFetcher } from './ethereum/iq.hiiq.contract-position-fetcher';
import { IqAppDefinition } from './iq.definition';

@Module({
  providers: [EthereumIqHiiqContractPositionFetcher, IqAppDefinition, IqContractFactory],
})
export class IqAppModule extends AbstractApp() {}
