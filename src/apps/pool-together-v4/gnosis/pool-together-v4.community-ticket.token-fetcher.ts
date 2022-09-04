import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV4CommunityTicketTokenFetcher } from '../common/pool-together-v4.community-ticket.token-fetcher';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

@Injectable()
export class GnosisPoolTogetherV4CommunityTicketTokenFetcher extends PoolTogetherV4CommunityTicketTokenFetcher {
  appId = POOL_TOGETHER_V4_DEFINITION.id;
  groupId = POOL_TOGETHER_V4_DEFINITION.groups.communityTicket.id;
  network = Network.GNOSIS_MAINNET;
  groupLabel = 'Community Prize Pools';
}
