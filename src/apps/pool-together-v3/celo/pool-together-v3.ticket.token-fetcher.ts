import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3TicketTokenFetcher } from '../common/pool-together-v3.ticket.token-fetcher';

@PositionTemplate()
export class CeloPoolTogetherV3TicketTokenFetcher extends PoolTogetherV3TicketTokenFetcher {
  groupLabel = 'Prize Pools';
  isExcludedFromExplore = true;
}
