import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PoolTogetherV4CommunityTicketTokenFetcher } from '../common/pool-together-v4.community-ticket.token-fetcher';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const appId = POOL_TOGETHER_V4_DEFINITION.id;
const groupId = POOL_TOGETHER_V4_DEFINITION.groups.communityTicket.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class GnosisPoolTogetherV4CommunityTicketTokenFetcher extends PoolTogetherV4CommunityTicketTokenFetcher {
  network = network;
  appId = appId;
  groupId = groupId;
  groupLabel = 'Community Prize Pools';
}
