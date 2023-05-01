import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PoolTogetherV3CommunityTicketTokenFetcher } from '../common/pool-together-v3.community-ticket.token-fetcher';

@PositionTemplate()
export class EthereumPoolTogetherV3CommunityTicketTokenFetcher extends PoolTogetherV3CommunityTicketTokenFetcher {
  groupLabel = 'Community Prize Pools';
  isExcludedFromExplore = true;

  TICKET_ADDRESS_RETURNED_BY_API = [
    '0xd81b1a8b1ad00baa2d6609e0bae28a38713872f7',
    '0x27d22a7648e955e510a40bdb058333e9190d12d4',
    '0xa92a861fc11b99b24296af880011b47f9cafb5ab',
    '0x27b85f596feb14e4b5faa9671720a556a7608c69',
    '0xeb8928ee92efb06c44d072a24c2bcb993b61e543',
    '0x0e930b8610229d74da0a174626138deb732ce6e9',
    '0xfdc192c153044dedb67c5a17b8651951cf70ee4a',
    '0xfa831a04cb52fc89dd519d08dc5e94ab2df52b7e',
    '0x1dea6d02325de05b1f412c9370653aae7cedf91f',
  ];
}
