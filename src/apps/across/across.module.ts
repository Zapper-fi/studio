import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossContractFactory } from './contracts';
import { EthereumAcrossPoolV1TokenFetcher } from './ethereum/across.pool-v1.token-fetcher';
import { EthereumAcrossPoolV2TokenFetcher } from './ethereum/across.pool-v2.token-fetcher';

@Module({
  providers: [AcrossContractFactory, EthereumAcrossPoolV1TokenFetcher, EthereumAcrossPoolV2TokenFetcher],
})
export class AcrossAppModule extends AbstractApp() {}
