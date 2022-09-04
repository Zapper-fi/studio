import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV4TicketTokenFetcher } from '../common/pool-together-v4.ticket.token-fetcher';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

@Injectable()
export class PolygonPoolTogetherV4TicketTokenFetcher extends PoolTogetherV4TicketTokenFetcher {
  appId = POOL_TOGETHER_V4_DEFINITION.id;
  groupId = POOL_TOGETHER_V4_DEFINITION.groups.ticket.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Prize Pools';
}
