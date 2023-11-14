import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EaseRcaDefinitionsResolver } from './common/ease.rca-definition-resolver';
import { EaseViemContractFactory } from './contracts';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';

@Module({
  providers: [EaseViemContractFactory, EaseRcaDefinitionsResolver, EthereumEaseRcaTokenFetcher],
})
export class EaseAppModule extends AbstractApp() {}
