import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
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

  async getLendingMeta(address: string, balances: ReadonlyBalances) {
    const collaterals = balances.filter(balance => balance.balanceUSD > 0);
    const debt = balances.filter(balance => balance.balanceUSD < 0);
    const totalCollateralUSD = sumBy(collaterals, a => a.balanceUSD);
    const totalDebtUSD = sumBy(debt, a => a.balanceUSD);
    const utilRatio = (Math.abs(totalDebtUSD) / totalCollateralUSD) * 100;

    const meta: MetadataItemWithLabel[] = [
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

    return meta;
  }

  @Register.BalanceProductMeta('Aurora Ecosystem Realm')
  async getAuroraEcosystemMeta(address: string, balances: ReadonlyBalances) {
    return this.getLendingMeta(address, balances);
  }

  @Register.BalanceProductMeta('Main Hub Realm')
  async getMainHubMeta(address: string, balances: ReadonlyBalances) {
    return this.getLendingMeta(address, balances);
  }

  @Register.BalanceProductMeta('Multichain Realm')
  async getMultichainMeta(address: string, balances: ReadonlyBalances) {
    return this.getLendingMeta(address, balances);
  }

  @Register.BalanceProductMeta('Staked NEAR Realm')
  async getStakedNearMeta(address: string, balances: ReadonlyBalances) {
    return this.getLendingMeta(address, balances);
  }
}
