import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EnsuroApiRegistry } from './common/ensuro.api-registry';
import { EnsuroViemContractFactory } from './contracts';
import { PolygonEnsuroETokenTokenFetcher } from './polygon/ensuro.e-token.token-fetcher';

@Module({
  providers: [EnsuroViemContractFactory, EnsuroApiRegistry, PolygonEnsuroETokenTokenFetcher],
})
export class EnsuroAppModule extends AbstractApp() {}
