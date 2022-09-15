import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3SponsorshipTokenFetcher } from '../common/pool-together-v3.sponsorship.token-fetcher';

@PositionTemplate()
export class CeloPoolTogetherV3SponsorshipTokenFetcher extends PoolTogetherV3SponsorshipTokenFetcher {
  groupLabel = 'Prize Pools';
  isExcludedFromExplore = true;
}
