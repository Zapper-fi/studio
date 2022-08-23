// import { Inject } from '@nestjs/common';
// import { entries, groupBy } from 'lodash';

// import { Register } from '~app-toolkit/decorators';
// import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
// import { CompoundLendingMetaHelper } from '~apps/compound';
// import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
// import { BalancePresenter } from '~balance/balance-presenter.interface';
// import { PositionBalance } from '~position/position-balance.interface';
// import { Network } from '~types/network.interface';

// import RARI_FUSE_DEFINITION from '../rari-fuse.definition';

// @Register.BalancePresenter({ appId: RARI_FUSE_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
// export class EthereumRariFuseBalancePresenter implements BalancePresenter {
//   constructor(
//     @Inject(CompoundLendingMetaHelper)
//     private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
//   ) {}

//   async present(_address: string, balances: PositionBalance<CompoundSupplyTokenDataProps>[]) {
//     // Group supply and borrow balances by their market
//     const balancesByMarket = groupBy(balances, v => v.dataProps.marketName);

//     // Augment with market supply/borrow amounts and health factor meta
//     const products = entries(balancesByMarket).map(([label, assets]) => ({
//       label,
//       assets,
//       meta: this.compoundLendingMetaHelper.getMeta({ balances: assets }),
//     }));

//     return presentBalanceFetcherResponse(products);
//   }
// }

import { Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Injectable()
export class EthereumRariFusePositionPresenter extends PositionPresenterTemplate {
  appId = RARI_FUSE_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;

  @Register.BalanceProductMeta('Lending')
  async getLendingMeta(address: string, balances: ReadonlyBalances) {
    const collaterals = balances.filter(balance => balance.balanceUSD > 0);
    const debt = balances.filter(balance => balance.balanceUSD < 0);
    const totalCollateralUSD = sumBy(collaterals, a => a.balanceUSD);
    const totalDebtUSD = sumBy(debt, a => a.balanceUSD);
    const utilRatio = (Math.abs(totalDebtUSD) / totalCollateralUSD) * 100;

    return [
      {
        label: 'Collateral',
        value: totalCollateralUSD,
        type: 'dollar',
      },
      {
        label: 'Debt',
        value: totalDebtUSD,
        type: 'dollar',
      },
      {
        label: 'Utilization Rate',
        value: utilRatio,
        type: 'pct',
      },
    ];
  }
}
