import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV4TicketTokenFetcher } from '../common/pool-together-v4.ticket.token-fetcher';

@PositionTemplate()
export class EthereumPoolTogetherV4TicketTokenFetcher extends PoolTogetherV4TicketTokenFetcher {
  groupLabel = 'Prize Pools';
}
