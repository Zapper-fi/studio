import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MahadaoViemContractFactory } from './contracts';
import { EthereumMahadaoLockerContractPositionFetcher } from './ethereum/mahadao.locker.contract-position-fetcher';

@Module({
  providers: [MahadaoViemContractFactory, EthereumMahadaoLockerContractPositionFetcher],
})
export class MahadaoAppModule extends AbstractApp() {}
