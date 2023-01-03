import { Inject } from '@nestjs/common';
import { formatBytes32String } from 'ethers/lib/utils';
import _ from 'lodash';

import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildNumberDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { SynthetixContractFactory } from '../contracts';

export type SynthetixPositionPresenterDataProps = {
  collateralUSD: number;
  debtBalanceUSD: number;
  cRatio: number;
  escrowed: number;
  unescrowed: number;
  snxPrice: number;
};

export abstract class SynthetixPositionPresenter extends PositionPresenterTemplate<SynthetixPositionPresenterDataProps> {
  abstract snxAddress: string;

  constructor(@Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory) {
    super();
  }

  async positionDataProps({
    address,
    groupLabel,
    balances,
  }: {
    address: string;
    groupLabel: string;
    balances: ReadonlyBalances;
  }): Promise<SynthetixPositionPresenterDataProps | undefined> {
    if (groupLabel !== 'Mintr') return;

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

    if (!snxPrice || !susdPrice) return;

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

    return { collateralUSD, debtBalanceUSD, cRatio, escrowed, unescrowed, snxPrice };
  }

  presentDataProps(dataProps: SynthetixPositionPresenterDataProps): MetadataItemWithLabel[] {
    const { collateralUSD, debtBalanceUSD, cRatio, escrowed, unescrowed, snxPrice } = dataProps;
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
