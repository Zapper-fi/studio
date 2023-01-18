import { sumBy } from 'lodash';

import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

@PresenterTemplate()
export class AuroraBastionProtocolPositionPresenter extends PositionPresenterTemplate {
  explorePresentationConfig: PresentationConfig = {
    tabs: [
      {
        label: 'Main Hub',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-main-hub'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-main-hub'],
          },
        ],
      },
      {
        label: 'Staked Near',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-staked-near'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-staked-near'],
          },
        ],
      },
      {
        label: 'Aurora Ecosystem',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-aurora-ecosystem'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-aurora-ecosystem'],
          },
        ],
      },
      {
        label: 'Multichain Realm',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-multichain'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-multichain'],
          },
        ],
      },
      {
        label: 'Stableswap Pools',
        viewType: 'list',
        groupIds: ['pool'],
      },
    ],
  };

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    _dataProps?: DefaultDataProps,
  ): MetadataItemWithLabel[] {
    if (['Staked NEAR Realm', 'Multichain Realm', 'Main Hub Realm', 'Aurora Ecosystem Realm'].includes(groupLabel)) {
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
