import { Inject } from '@nestjs/common';
import { entries, groupBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundLendingMetaHelper } from '~apps/compound';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { BalancePresenter } from '~balance/balance-presenter.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import RARI_FUSE_DEFINITION from '../rari-fuse.definition';

@Register.BalancePresenter({ appId: RARI_FUSE_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
export class EthereumRariFuseBalancePresenter implements BalancePresenter {
  constructor(
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
  ) {}

  async present(_address: string, balances: PositionBalance<CompoundSupplyTokenDataProps>[]) {
    // Group supply and borrow balances by their market
    const balancesByMarket = groupBy(balances, v => v.dataProps.marketName);

    // Augment with market supply/borrow amounts and health factor meta
    const products = entries(balancesByMarket).map(([label, assets]) => ({
      label,
      assets,
      meta: this.compoundLendingMetaHelper.getMeta({ balances: assets }),
    }));

    return presentBalanceFetcherResponse(products);
  }
}
