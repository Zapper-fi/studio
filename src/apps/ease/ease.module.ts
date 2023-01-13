import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EaseRcaDefinitionsResolver } from './common/ease.rca-definition-resolver';
import { EaseContractFactory } from './contracts';
import { EaseAppDefinition } from './ease.definition';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';

@Module({
  providers: [EaseContractFactory, EaseRcaDefinitionsResolver, EthereumEaseRcaTokenFetcher],
})
export class EaseAppModule extends AbstractApp() {}
