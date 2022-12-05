import _ from 'lodash';

import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';

import { ReadonlyBalances } from './template/position-presenter.template';

export type LendingDataProps = {
  totalCollateralUSD: number;
  totalDebtUSD: number;
  utilRatio: number;
};

export function lendingDataProps(balances: ReadonlyBalances): LendingDataProps {
  const collaterals = balances.filter(balance => balance.balanceUSD > 0);
  const debt = balances.filter(balance => balance.balanceUSD < 0);
  const totalCollateralUSD = _.sumBy(collaterals, a => a.balanceUSD);
  const totalDebtUSD = _.sumBy(debt, a => a.balanceUSD);
  const utilRatio = (Math.abs(totalDebtUSD) / totalCollateralUSD) * 100;

  return {
    totalCollateralUSD,
    totalDebtUSD,
    utilRatio,
  };
}

export function presentLendingDataProps(lendingTotals: LendingDataProps): MetadataItemWithLabel[] {
  const { totalCollateralUSD, totalDebtUSD, utilRatio } = lendingTotals;
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
