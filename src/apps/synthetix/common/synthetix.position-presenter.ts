import { Inject } from '@nestjs/common';
import { formatBytes32String } from 'ethers/lib/utils';

import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildNumberDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractPosition } from '~position/position.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { SynthetixContractFactory } from '../contracts';

export abstract class SynthetixPositionPresenter extends PositionPresenterTemplate {
  abstract snxAddress: string;

  constructor(@Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory) {
    super();
  }

  @Register.BalanceProductMeta('Mintr')
  async getMintrMeta(address: string, balances: ReadonlyBalances) {
    const position = balances[0] as ContractPosition;
    const snxBalance = position.tokens?.find(v => v.symbol === 'SNX');
    const sUSDBalance = position.tokens?.find(v => v.symbol === 'sUSD');
    if (!snxBalance || !sUSDBalance) return [];

    const synthetixContract = this.contractFactory.synthetixNetworkToken({
      address: this.snxAddress,
      network: this.network,
    });

    const [unlockedSnxRaw, collateralRaw, debtBalanceRaw] = await Promise.all([
      synthetixContract.balanceOf(address),
      synthetixContract.collateral(address),
      synthetixContract.debtBalanceOf(address, formatBytes32String('sUSD')),
    ]);

    // Collateral and debt computations
    const collateralBalance = Number(collateralRaw) / 10 ** 18;
    const unlockedSnx = Number(unlockedSnxRaw) / 10 ** 18;
    const debtBalance = Number(debtBalanceRaw) / 10 ** 18;
    const collateralUSD = collateralBalance * snxBalance.price;
    const debtBalanceUSD = -debtBalance * sUSDBalance.price;
    const cRatio = debtBalance > 0 ? (collateralUSD / debtBalance) * 100 : 1;
    const escrowed = collateralBalance - unlockedSnx;
    const unescrowed = unlockedSnx;

    return [
      { label: 'Collateral', ...buildDollarDisplayItem(collateralUSD) },
      { label: 'Debt', ...buildDollarDisplayItem(debtBalanceUSD) },
      { label: 'C-Ratio', ...buildPercentageDisplayItem(cRatio) },
      { label: 'Escrowed SNX', ...buildNumberDisplayItem(escrowed) },
      { label: 'Unescrowed SNX', ...buildNumberDisplayItem(unescrowed) },
      { label: 'SNX Price', ...buildDollarDisplayItem(snxBalance.price) },
    ];
  }
}
