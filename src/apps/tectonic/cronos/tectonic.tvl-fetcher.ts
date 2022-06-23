import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundTvlHelper } from '~apps/compound';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { TECTONIC_DEFINITION } from '../tectonic.definition';

const appId = TECTONIC_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.TvlFetcher({ appId, network })
export class CronosTectonicTvlFetcher implements TvlFetcher {
  constructor(@Inject(CompoundTvlHelper) private readonly tvlHelper: CompoundTvlHelper) {}

  async getTvl() {
    const tvl = await this.tvlHelper.getTotalSupplyBasedOnBorrowedPositions({
      appId,
      groupIds: [TECTONIC_DEFINITION.groups.borrow.id],
      network,
    });

    return tvl;
  }
}
