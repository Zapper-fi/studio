import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV3PrizePoolTokenHelper } from '../helpers/pool-together-v3.prize-pool.token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

@Register.TokenPositionFetcher({
  appId: POOL_TOGETHER_DEFINITION.id,
  groupId: POOL_TOGETHER_DEFINITION.groups.v3.id,
  network: Network.POLYGON_MAINNET,
})
export class PolygonPoolTogetherV3TicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV3PrizePoolTokenHelper)
    private readonly poolTogetherV3PrizePoolTokenHelper: PoolTogetherV3PrizePoolTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherV3PrizePoolTokenHelper.getTokens({
      network: Network.POLYGON_MAINNET,
      prizePoolAddresses: ['0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4', '0xee06abe9e2af61cabcb13170e01266af2defa946'],
      dependencies: [],
    });
  }
}
