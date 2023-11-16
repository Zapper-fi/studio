import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { YamatoViemContractFactory } from './contracts';
import { EthereumYamatoPledgeContractPositionFetcher } from './ethereum/yamato.pledge.contract-position-fetcher';

@Module({
  providers: [EthereumYamatoPledgeContractPositionFetcher, YamatoViemContractFactory],
})
export class YamatoAppModule extends AbstractApp() {}
