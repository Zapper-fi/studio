import { Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';

type CompoundLendingMetaHelperParams = {
  balances: (TokenBalance | ContractPositionBalance)[];
};

@Injectable()
export class CompoundLendingMetaHelper {
  getMeta({ balances }: CompoundLendingMetaHelperParams) {
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
}
