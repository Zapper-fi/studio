import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { IRON_BANK_DEFINITION } from '../iron-bank.definition';
import { IronBankTvlHelper } from '../helper/ironBank.tvl-helper';

const appId = IRON_BANK_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TvlFetcher({ appId, network })
export class FantomIronBankTvlFetcher implements TvlFetcher {
  constructor(@Inject(IronBankTvlHelper) private readonly ironBankTvlHelper: IronBankTvlHelper) {}

  async getTvl() {
    const tvl = await this.ironBankTvlHelper.getLiquidityBasedOnBorrowedPositions({
      appId,
      groupIds: [IRON_BANK_DEFINITION.groups.borrow.id],
      network,
    });

    return tvl;
  }
}
