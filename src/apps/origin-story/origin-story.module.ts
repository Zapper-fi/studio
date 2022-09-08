import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OriginStoryContractFactory } from './contracts';
import { EthereumOriginStorySeriesContractPositionFetcher } from './ethereum/origin-story.series.contract-position-fetcher';
import { OriginStoryAppDefinition, ORIGIN_STORY_DEFINITION } from './origin-story.definition';

@Register.AppModule({
  appId: ORIGIN_STORY_DEFINITION.id,
  providers: [OriginStoryAppDefinition, OriginStoryContractFactory, EthereumOriginStorySeriesContractPositionFetcher],
})
export class OriginStoryAppModule extends AbstractApp() {}
