import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionService } from '~position/position.service';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.TvlFetcher({ appId: SYNTHETIX_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
export class EthereumSynthetixTvlFetcher extends TvlFetcher {
  constructor(@Inject(PositionService) private readonly positionService: PositionService) {
    super();
  }

  async getTvl() {
    const pools = await this.positionService.getAppTokenPositions({
      appId: SYNTHETIX_DEFINITION.id,
      groupIds: [SYNTHETIX_DEFINITION.groups.synth.id],
      network: Network.POLYGON_MAINNET,
    });

    return this.sumPositions(pools);
  }
}
