import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { JarvisViemContractFactory } from './contracts';
import { PolygonJarvisSynthTokenFetcher } from './polygon/jarvis.synth.token-fetcher';

@Module({
  providers: [JarvisViemContractFactory, PolygonJarvisSynthTokenFetcher],
})
export class JarvisAppModule extends AbstractApp() {}
