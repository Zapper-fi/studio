import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { JarvisContractFactory } from './contracts';
import { JarvisAppDefinition, JARVIS_DEFINITION } from './jarvis.definition';
import { PolygonJarvisSynthTokenFetcher } from './polygon/jarvis.synth.token-fetcher';

@Register.AppModule({
  appId: JARVIS_DEFINITION.id,
  providers: [JarvisAppDefinition, JarvisContractFactory, PolygonJarvisSynthTokenFetcher],
})
export class JarvisAppModule extends AbstractApp() {}
