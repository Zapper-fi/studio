import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4PrizePoolTokenHelper } from '../helpers/pool-together-v4.prize-pool.token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.v4.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPoolTogetherV4TicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV4PrizePoolTokenHelper)
    private readonly poolTogetherTicketTokenHelper: PoolTogetherV4PrizePoolTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherTicketTokenHelper.getAppTokens({
      network: Network.ETHEREUM_MAINNET,
      prizePoolAddresses: ['0xd89a09084555a7d0abe7b111b1f78dfeddd638be'],
    });
  }
}
