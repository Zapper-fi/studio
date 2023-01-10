import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { JarvisContractFactory } from './contracts';
import { JarvisAppDefinition } from './jarvis.definition';
import { PolygonJarvisSynthTokenFetcher } from './polygon/jarvis.synth.token-fetcher';

@Module({
  providers: [JarvisAppDefinition, JarvisContractFactory, PolygonJarvisSynthTokenFetcher],
})
export class JarvisAppModule extends AbstractApp() {}
