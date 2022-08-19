import { Injectable } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';

import { MorphoCompoundLens } from '~apps/morpho/contracts';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';

@Injectable()
export class MorphoCompoundLendingMetaHelper {
  async getMeta(address: string, lens: MorphoCompoundLens, marketsToUpdate: string[] = []) {
    const { collateralValue, debtValue, maxDebtValue } = await lens.getUserBalanceStates(address, marketsToUpdate);
    const totalDebt = +formatUnits(debtValue);
    const maxDebt = +formatUnits(maxDebtValue);
    const meta: MetadataItemWithLabel[] = [
      {
        label: 'Collateral',
        value: maxDebt,
        type: 'dollar',
      },
      {
        label: 'Total Supply',
        value: +formatUnits(collateralValue),
        type: 'dollar',
      },
      {
        label: 'Debt',
        value: totalDebt,
        type: 'dollar',
      },
      {
        label: 'Utilization Rate',
        value: maxDebt > 0 ? totalDebt / maxDebt : 0,
        type: 'pct',
      },
    ];

    return meta;
  }
}
