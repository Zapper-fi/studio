import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PoolTogetherV4TicketTokenFetcher } from '../common/pool-together-v4.ticket.token-fetcher';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const appId = POOL_TOGETHER_V4_DEFINITION.id;
const groupId = POOL_TOGETHER_V4_DEFINITION.groups.ticket.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonPoolTogetherV4TicketTokenFetcher extends PoolTogetherV4TicketTokenFetcher {
  network = network;
  appId = appId;
  groupId = groupId;
  groupLabel = 'Prize Pools';
}
