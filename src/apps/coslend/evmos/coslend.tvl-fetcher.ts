import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { COSLEND_DEFINITION } from '../coslend.definition';
import { CoslendTvlHelper } from '../helper/coslend.tvl-helper';

const appId = COSLEND_DEFINITION.id;
const network = Network.EVMOS_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EvmosCoslendTvlFetcher implements TvlFetcher {
  constructor(@Inject(CoslendTvlHelper) private readonly coslendTvlHelper: CoslendTvlHelper) {}

  async getTvl() {
    const tvl = await this.coslendTvlHelper.getTotalSupplyBasedOnBorrowedPositions({
      appId,
      groupIds: [COSLEND_DEFINITION.groups.borrow.id],
      network,
    });
    return tvl;
  }
}
