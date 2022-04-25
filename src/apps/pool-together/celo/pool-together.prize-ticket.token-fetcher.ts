import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherPrizeTicketTokenHelper } from '../helpers/pool-together.prize-ticket.token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.TokenPositionFetcher({
  appId: POOL_TOGETHER_DEFINITION.id,
  groupId: POOL_TOGETHER_DEFINITION.groups.prizeTicket.id,
  network: Network.CELO_MAINNET,
})
export class CeloPoolTogetherPrizeTicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherPrizeTicketTokenHelper)
    private readonly poolTogetherPrizeTicketTokenHelper: PoolTogetherPrizeTicketTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherPrizeTicketTokenHelper.getTokens({
      network: Network.CELO_MAINNET,
      prizePoolAddresses: ['0x6f634f531ed0043b94527f68ec7861b4b1ab110d', '0xbe55435bda8f0a2a20d2ce98cc21b0af5bfb7c83'],
      dependencies: [],
    });
  }
}
