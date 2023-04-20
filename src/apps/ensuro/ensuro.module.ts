import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EnsuroContractFactory } from './contracts';
import {
  PolygonEnsuroETokenTokenFetcher,
} from './polygon/ensuro.etoken.token-fetcher';
import { EnsuroApiJarRegistry } from './polygon/ensuro.api.jar-registry';

@Module({
  providers: [EnsuroContractFactory, EnsuroApiJarRegistry, PolygonEnsuroETokenTokenFetcher],
})
export class EnsuroAppModule extends AbstractApp() {}
