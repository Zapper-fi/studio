import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MahadaoContractFactory } from './contracts';
import { EthereumMahadaoLockerContractPositionFetcher } from './ethereum/mahadao.locker.contract-position-fetcher';
import { MahadaoAppDefinition } from './mahadao.definition';

@Module({
  providers: [MahadaoContractFactory, EthereumMahadaoLockerContractPositionFetcher],
})
export class MahadaoAppModule extends AbstractApp() {}
