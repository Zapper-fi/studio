import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { COMPOUND_DEFINITION } from '../compound.definition';
import { CompoundTvlHelper } from '../helper/compound.tvl-helper';

const appId = COMPOUND_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumCompoundTvlFetcher implements TvlFetcher {
  constructor(@Inject(CompoundTvlHelper) private readonly compoundTvlHelper: CompoundTvlHelper) {}

  async getTvl() {
    const tvl = await this.compoundTvlHelper.getTotalSupplyBasedOnBorrowedPositions({
      appId,
      groupIds: [COMPOUND_DEFINITION.groups.borrow.id],
      network,
    });

    return tvl;
  }
}
