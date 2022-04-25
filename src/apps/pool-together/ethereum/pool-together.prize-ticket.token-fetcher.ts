import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2/uniswap-v2.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherPrizeTicketTokenHelper } from '../helpers/pool-together.prize-ticket.token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.prizeTicket.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPoolTogetherPrizeTicketTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherPrizeTicketTokenHelper)
    private readonly poolTogetherPrizeTicketTokenHelper: PoolTogetherPrizeTicketTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherPrizeTicketTokenHelper.getTokens({
      network,
      prizePoolAddresses: [
        '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a',
        '0x0650d780292142835f6ac58dd8e2a336e87b4393',
        '0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416',
        '0xbc82221e131c082336cf698f0ca3ebd18afd4ce7',
        '0x396b4489da692788e327e2e4b2b0459a5ef26791',
        '0xc2a7dfb76e93d12a1bb1fa151b9900158090395d',
        '0xc32a0f9dfe2d93e8a60ba0200e033a59aec91559',
        '0x65c8827229fbd63f9de9fdfd400c9d264066a336',
        '0x3af7072d29adde20fc7e173a7cb9e45307d2fb0a',
      ],
      dependencies: [
        {
          appId: UNISWAP_V2_DEFINITION.id,
          groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: POOL_TOGETHER_DEFINITION.id,
          groupIds: [POOL_TOGETHER_DEFINITION.groups.prizeTicket.id], // For pPOOL drip
          network,
        },
      ],
    });
  }
}
