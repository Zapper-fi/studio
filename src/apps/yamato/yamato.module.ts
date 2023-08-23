import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { YamatoContractFactory } from './contracts';
import { EthereumYamatoPledgeContractPositionFetcher } from './ethereum/yamato.pledge.contract-position-fetcher';

@Module({
  providers: [EthereumYamatoPledgeContractPositionFetcher, YamatoContractFactory],
})
export class YamatoAppModule extends AbstractApp() {}
