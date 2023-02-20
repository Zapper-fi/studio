import { sumBy } from 'lodash';

import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

export abstract class CompoundPositionPresenter extends PositionPresenterTemplate {
  explorePresentationConfig?: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  };

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    _dataProps?: DefaultDataProps,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Lending') {
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

    return [];
  }
}
