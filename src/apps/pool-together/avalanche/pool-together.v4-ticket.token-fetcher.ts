import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4PrizePoolTokenHelper } from '../helpers/pool-together-v4.prize-pool.token-helper';
import { PoolTogetherApiPrizePoolRegistry } from '../helpers/pool-together.api.prize-pool-registry';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.v4.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePoolTogetherV4TicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV4PrizePoolTokenHelper)
    private readonly poolTogetherV4PrizePoolTokenHelper: PoolTogetherV4PrizePoolTokenHelper,
    @Inject(PoolTogetherApiPrizePoolRegistry) private readonly prizePoolRegistry: PoolTogetherApiPrizePoolRegistry,
  ) {}

  async getPositions() {
    const prizePools = await this.prizePoolRegistry.getV4PrizePools(network);

    return this.poolTogetherV4PrizePoolTokenHelper.getAppTokens({
      network,
      prizePoolAddresses: prizePools?.map(prizePoolAddresses => prizePoolAddresses.prizePoolAddress) || [],
    });
  }
}
