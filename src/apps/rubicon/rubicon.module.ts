import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconBathTokenDefinitionResolver } from './common/rubicon.bath.token-definition-resolver';
import { RubiconViemContractFactory } from './contracts';
import { OptimismRubiconBathTokenFetcher } from './optimism/rubicon.bath.token-fetcher';

@Module({
  providers: [RubiconViemContractFactory, RubiconBathTokenDefinitionResolver, OptimismRubiconBathTokenFetcher],
})
export class RubiconAppModule extends AbstractApp() {}
