import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { IRON_BANK_DEFINITION } from '../iron-bank.definition';
import { CompoundTvlHelper } from '~apps/compound/helper/compound.tvl-helper';

const appId = IRON_BANK_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumIronBankTvlFetcher implements TvlFetcher {
  constructor(@Inject(CompoundTvlHelper) private readonly compoundTvlHelper: CompoundTvlHelper) {}

  async getTvl() {
    const totalSupplyBasedOnBorrowedPositions = await this.compoundTvlHelper.getTotalSupplyBasedOnBorrowedPositions({
      appId,
      groupIds: [IRON_BANK_DEFINITION.groups.borrow.id],
      network,
    });
    const liquidityBasedOnBorrowedPositions = await this.compoundTvlHelper.getLiquidityBasedOnBorrowedPositions({
      appId,
      groupIds: [IRON_BANK_DEFINITION.groups.borrow.id],
      network,
    });
    return totalSupplyBasedOnBorrowedPositions + liquidityBasedOnBorrowedPositions;
  }
}
