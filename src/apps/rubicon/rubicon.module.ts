import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RubiconBathTokenDefinitionResolver } from './common/rubicon.bath.token-definition-resolver';
import { RubiconContractFactory } from './contracts';
import { OptimismRubiconBathTokenFetcher } from './optimism/rubicon.bath.token-fetcher';
import { RubiconAppDefinition } from './rubicon.definition';

@Module({
  providers: [
    RubiconAppDefinition,
    RubiconContractFactory,
    RubiconBathTokenDefinitionResolver,
    OptimismRubiconBathTokenFetcher,
  ],
})
export class RubiconAppModule extends AbstractApp() {}
