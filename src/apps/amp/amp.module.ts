import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AmpContractFactory } from './contracts';
import { EthereumAmpFarmContractPositionFetcher } from './ethereum/amp.farm.contract-position-fetcher';

@Module({
  providers: [AmpContractFactory, EthereumAmpFarmContractPositionFetcher],
})
export class AmpAppModule extends AbstractApp() {}
