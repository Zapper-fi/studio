import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3CommunityTicketTokenFetcher } from '../common/pool-together-v3.community-ticket.token-fetcher';
import { POOL_TOGETHER_V3_DEFINITION } from '../pool-together-v3.definition';

@Injectable()
export class GnosisPoolTogetherV3CommunityTicketTokenFetcher extends PoolTogetherV3CommunityTicketTokenFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.communityTicket.id;
  network = Network.GNOSIS_MAINNET;
  groupLabel = 'Community Prize Pools';
  isExcludedFromExplore = true;
}
