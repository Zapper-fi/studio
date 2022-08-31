import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OriginStoryContractFactory } from './contracts';
import { EthereumOriginStoryBalanceFetcher } from './ethereum/origin-story.balance-fetcher';
import { EthereumOriginStorySeriesContractPositionFetcher } from './ethereum/origin-story.series.contract-position-fetcher';
import { OriginStoryAppDefinition, ORIGIN_STORY_DEFINITION } from './origin-story.definition';

@Register.AppModule({
  appId: ORIGIN_STORY_DEFINITION.id,
  providers: [
    EthereumOriginStoryBalanceFetcher,
    EthereumOriginStorySeriesContractPositionFetcher,
    OriginStoryAppDefinition,
    OriginStoryContractFactory,
  ],
})
export class OriginStoryAppModule extends AbstractApp() {}
