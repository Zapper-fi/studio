import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3CommunityTicketTokenFetcher } from '../common/pool-together-v3.community-ticket.token-fetcher';

@PositionTemplate()
export class PolygonPoolTogetherV3CommunityTicketTokenFetcher extends PoolTogetherV3CommunityTicketTokenFetcher {
  groupLabel = 'Community Prize Pools';
  isExcludedFromExplore = true;

  TICKET_ADDRESS_RETURNED_BY_API = [
    '0x9ecb26631098973834925eb453de1908ea4bdd4e',
    '0x473e484c722ef9ec6f63b509b07bb9cfb258820b',
    '0x86ee1ba18903029b2e748762627a53cbe1c79c3f',
  ];
}
