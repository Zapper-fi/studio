import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV3ApiPrizePoolRegistry } from '../helpers/pool-together-v3.api.prize-pool-registry';
import { PoolTogetherV3PrizePoolTokenHelper } from '../helpers/pool-together-v3.prize-pool.token-helper';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

const appId = POOL_TOGETHER_V3_DEFINITION.id;
const groupId = POOL_TOGETHER_V3_DEFINITION.groups.ticket.id;
const network = Network.CELO_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CeloPoolTogetherV3TicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV3PrizePoolTokenHelper)
    private readonly poolTogetherV3PrizePoolTokenHelper: PoolTogetherV3PrizePoolTokenHelper,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry) private readonly prizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {}

  async getPositions() {
    const prizePools = await this.prizePoolRegistry.getV3PrizePools(network);

    return this.poolTogetherV3PrizePoolTokenHelper.getTokens({
      network,
      prizePools,
    });
  }
}
