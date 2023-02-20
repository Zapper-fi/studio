import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3CommunityTicketTokenFetcher } from '../common/pool-together-v3.community-ticket.token-fetcher';

@PositionTemplate()
export class GnosisPoolTogetherV3CommunityTicketTokenFetcher extends PoolTogetherV3CommunityTicketTokenFetcher {
  groupLabel = 'Community Prize Pools';
  isExcludedFromExplore = true;
}
