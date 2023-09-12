import { Inject } from '@nestjs/common';
import { formatBytes32String } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildNumberDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { SynthetixContractFactory } from '../contracts';

export type SynthetixPositionPresenterDataProps = {
  snxPrice: number;
  susdPrice: number;
  collateralBalance: number;
  unlockedSnx: number;
  debtBalance: number;
};

export abstract class SynthetixPositionPresenter extends PositionPresenterTemplate<SynthetixPositionPresenterDataProps> {
  abstract snxAddress: string;
  abstract sUSDAddress: string;

  constructor(
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super();
  }

  override async dataProps(address: string): Promise<SynthetixPositionPresenterDataProps | undefined> {
    const [snxToken, susdToken] = await Promise.all([
      this.appToolkit.getBaseTokenPrice({
        network: this.network,
        address: this.snxAddress,
      }),
      this.appToolkit.getBaseTokenPrice({
        network: this.network,
        address: this.sUSDAddress,
      }),
    ]);

    if (!snxToken || !susdToken) return;
    const snxPrice = snxToken.price;
    const susdPrice = susdToken.price;

    const synthetixContract = this.contractFactory.synthetixNetworkToken({
      address: this.snxAddress,
      network: this.network,
    });

    const [unlockedSnxRaw, collateralRaw, debtBalanceRaw] = await Promise.all([
      synthetixContract.balanceOf(address),
      synthetixContract.collateral(address),
      synthetixContract.debtBalanceOf(address, formatBytes32String('sUSD')),
    ]);

    const collateralBalance = Number(collateralRaw) / 10 ** 18;
    const unlockedSnx = Number(unlockedSnxRaw) / 10 ** 18;
    const debtBalance = Number(debtBalanceRaw) / 10 ** 18;

    return { snxPrice, susdPrice, collateralBalance, unlockedSnx, debtBalance };
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    _balances: ReadonlyBalances,
    dataProps?: SynthetixPositionPresenterDataProps,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Mintr') {
      if (!dataProps) return [];

      const { snxPrice, susdPrice, collateralBalance, unlockedSnx, debtBalance } = dataProps;

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
    return [];
  }
}
