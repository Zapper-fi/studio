import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3TicketTokenFetcher } from '../common/pool-together-v3.ticket.token-fetcher';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

@Injectable()
export class CeloPoolTogetherV3TicketTokenFetcher extends PoolTogetherV3TicketTokenFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.ticket.id;
  network = Network.CELO_MAINNET;
  groupLabel = 'Prize Pools';
}
