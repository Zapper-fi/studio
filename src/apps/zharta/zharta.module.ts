import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ZhartaContractFactory } from './contracts';
import { EthereumZhartaLendingPoolCoreContractPositionFetcher } from './ethereum/zharta.lending-pool-core.contract-position-fetcher';

@Module({
  providers: [EthereumZhartaLendingPoolCoreContractPositionFetcher, ZhartaContractFactory],
})
export class ZhartaAppModule extends AbstractApp() {}
