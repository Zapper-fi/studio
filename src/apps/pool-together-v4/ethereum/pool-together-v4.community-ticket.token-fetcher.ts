import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV4CommunityTicketTokenFetcher } from '../common/pool-together-v4.community-ticket.token-fetcher';
import { PoolWithMultipleWinnersBuilderCreatedType } from '../common/pool-together-v4.log-provider';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

@Injectable()
export class EthereumPoolTogetherV4CommunityTicketTokenFetcher extends PoolTogetherV4CommunityTicketTokenFetcher {
  appId = POOL_TOGETHER_V4_DEFINITION.id;
  groupId = POOL_TOGETHER_V4_DEFINITION.groups.communityTicket.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Community Prize Pools';

  extraDefinitions = [
    {
      type: PoolWithMultipleWinnersBuilderCreatedType.COMPOUND,
      address: '0x334cbb5858417aee161b53ee0d5349ccf54514cf',
      prizePool: '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a',
      prizeStrategy: '0x178969a87a78597d303c47198c66f68e8be67dc2',
    },
  ];
}
