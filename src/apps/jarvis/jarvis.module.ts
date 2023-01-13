import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { JarvisContractFactory } from './contracts';
import { PolygonJarvisSynthTokenFetcher } from './polygon/jarvis.synth.token-fetcher';

@Module({
  providers: [JarvisContractFactory, PolygonJarvisSynthTokenFetcher],
})
export class JarvisAppModule extends AbstractApp() {}
