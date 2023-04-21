import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EnsuroContractFactory } from './contracts';
import {
  PolygonEnsuroETokenTokenFetcher,
} from './polygon/ensuro.etoken.token-fetcher';
import { EnsuroApiRegistry } from './common/ensuro.api-registry';

@Module({
  providers: [EnsuroContractFactory, EnsuroApiRegistry, PolygonEnsuroETokenTokenFetcher],
})
export class EnsuroAppModule extends AbstractApp() {}
