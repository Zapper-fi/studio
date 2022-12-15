import { Inject } from '@nestjs/common';
import { formatBytes32String } from 'ethers/lib/utils';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildNumberDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractType } from '~position/contract.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { SynthetixContractFactory } from '../contracts';

export abstract class SynthetixPositionPresenter extends PositionPresenterTemplate {
  abstract snxAddress: string;

  constructor(@Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory) {
    super();
  }

  @Register.BalanceProductMeta('Mintr')
  async getMintrMeta(address: string, balances: ReadonlyBalances) {
    let snxPrice: number | undefined;
    let susdPrice: number | undefined;

    // Search for the first position with the SNX & SUSD token to get the price of the 2 tokens.
    for (const b of balances) {
      if (b.type !== ContractType.POSITION) continue;

      const tokensBySymbols = _(b.tokens)
        .groupBy(t => t.symbol)
        .mapValues(v => v[0])
        .value();

      const snxToken = tokensBySymbols['SNX'];
      const susdToken = tokensBySymbols['sUSD'];

      if (snxToken && susdToken) {
        snxPrice = snxToken.price;
        susdPrice = susdToken.price;
        break;
      }
    }

    if (!snxPrice || !susdPrice) return [];

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
    const collateralUSD = collateralBalance * snxPrice;
    const debtBalanceUSD = -debtBalance * susdPrice;
    const cRatio = debtBalance > 0 ? (collateralUSD / debtBalance) * 100 : 1;
    const escrowed = collateralBalance - unlockedSnx;
    const unescrowed = unlockedSnx;

    return [
      { label: 'Collateral', ...buildDollarDisplayItem(collateralUSD) },
      { label: 'Debt', ...buildDollarDisplayItem(debtBalanceUSD) },
      { label: 'C-Ratio', ...buildPercentageDisplayItem(cRatio) },
      { label: 'Escrowed SNX', ...buildNumberDisplayItem(escrowed) },
      { label: 'Unescrowed SNX', ...buildNumberDisplayItem(unescrowed) },
      { label: 'SNX Price', ...buildDollarDisplayItem(snxPrice) },
    ];
  }
}
