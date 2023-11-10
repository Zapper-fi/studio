import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ZhartaViemContractFactory } from './contracts';
import { EthereumZhartaLendingPoolCoreContractPositionFetcher } from './ethereum/zharta.lending-pool-core.contract-position-fetcher';

@Module({
  providers: [EthereumZhartaLendingPoolCoreContractPositionFetcher, ZhartaViemContractFactory],
})
export class ZhartaAppModule extends AbstractApp() {}
