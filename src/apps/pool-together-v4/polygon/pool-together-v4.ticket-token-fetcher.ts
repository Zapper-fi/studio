import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4ApiPrizePoolRegistry } from '../helpers/pool-together-v4.api.prize-pool-registry';
import { PoolTogetherV4PrizePoolTokenHelper } from '../helpers/pool-together-v4.prize-pool.token-helper';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const appId = POOL_TOGETHER_V4_DEFINITION.id;
const groupId = POOL_TOGETHER_V4_DEFINITION.groups.ticket.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonPoolTogetherV4TicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV4PrizePoolTokenHelper)
    private readonly poolTogetherV4PrizePoolTokenHelper: PoolTogetherV4PrizePoolTokenHelper,
    @Inject(PoolTogetherV4ApiPrizePoolRegistry) private readonly prizePoolRegistry: PoolTogetherV4ApiPrizePoolRegistry,
  ) {}

  async getPositions() {
    const prizePools = await this.prizePoolRegistry.getV4PrizePools(network);

    return this.poolTogetherV4PrizePoolTokenHelper.getAppTokens({
      network,
      prizePoolAddresses: prizePools?.map(prizePoolAddresses => prizePoolAddresses.prizePoolAddress) || [],
    });
  }
}
