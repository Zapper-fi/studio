import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { OriginStorySeriesContractPositionFetcher } from '../common/origin-story.series.contract-position-fetcher';
import ORIGIN_STORY_DEFINITION from '../origin-story.definition';

@Injectable()
export class EthereumOriginStorySeriesContractPositionFetcher extends OriginStorySeriesContractPositionFetcher {
  appId = ORIGIN_STORY_DEFINITION.id;
  groupId = ORIGIN_STORY_DEFINITION.groups.series.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Series';
}
