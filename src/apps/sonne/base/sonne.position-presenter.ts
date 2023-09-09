import { sum, sumBy } from 'lodash';

import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isContractPosition } from '~position/position.interface';
import { ReadonlyBalances } from '~position/template/position-presenter.template';

import { SonneBorrowTokenDataProps } from './sonne.borrow.contract-position-fetcher';

@PresenterTemplate()
export class BaseSonnePositionPresenter extends CompoundPositionPresenter {
  protected getHealthFactor(
    totalCollateralUSD: number,
    borrowPositionBalances: ContractPositionBalance<SonneBorrowTokenDataProps>[],
  ) {
    const debt = borrowPositionBalances.filter(balance => balance.balanceUSD < 0);
    if (debt.length == 0) return 100;

    const totalDebtUSD = sumBy(debt, a => a.balanceUSD);

    const healthFactorsRatio = debt.map(balance => {
      const healthFactor = (totalCollateralUSD * balance.dataProps.collateralFactor) / Math.abs(balance.balanceUSD);
      const debtRatio = balance.balanceUSD / totalDebtUSD;

      return healthFactor * debtRatio;
    });

    return sum(healthFactorsRatio) / healthFactorsRatio.length;
  }
  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    _dataProps?: DefaultDataProps | undefined,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Lending') {
      const borrowPositionBalances = balances.filter((v): v is ContractPositionBalance<SonneBorrowTokenDataProps> =>
        isContractPosition(v),
      );

      const collaterals = balances.filter(balance => balance.balanceUSD > 0);
      const debt = balances.filter(balance => balance.balanceUSD < 0);
      const totalCollateralUSD = sumBy(collaterals, a => a.balanceUSD);
      const totalDebtUSD = sumBy(debt, a => a.balanceUSD);
      const utilRatio = (Math.abs(totalDebtUSD) / totalCollateralUSD) * 100;
      const healthFactor = this.getHealthFactor(totalCollateralUSD, borrowPositionBalances);

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
        {
          label: 'Health Factor',
          value: healthFactor,
          type: 'number',
        },
      ];
    }

    return [];
  }
}
