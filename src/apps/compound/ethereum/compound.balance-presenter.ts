import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { Balance, BalancePresenterTemplate, GroupMeta } from '~position/template/balance-presenter.template';
import { Network } from '~types';

import { COMPOUND_DEFINITION } from '../compound.definition';

@Register.BalancePresenter({ appId: COMPOUND_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
export class EthereumCompoundBalancePresenter extends BalancePresenterTemplate {
  groupLabelSelector = `groupLabel`;

  @Register.GroupMeta('Lending')
  async getLendingMeta(balances: readonly Balance[]): Promise<GroupMeta> {
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
