import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { OriginStorySeriesContractPositionFetcher } from '../common/origin-story.series.contract-position-fetcher';

@PositionTemplate()
export class EthereumOriginStorySeriesContractPositionFetcher extends OriginStorySeriesContractPositionFetcher {
  groupLabel = 'Series';
}
