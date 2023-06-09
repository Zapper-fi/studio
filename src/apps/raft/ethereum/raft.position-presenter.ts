import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { RaftContractFactory } from '../contracts';

export const positionManagerAddress = '0x5f59b322eb3e16a0c78846195af1f588b77403fc'

export type RaftPositionPresenterDataProps = {
  minCRatio: number;
};

export class EthereumRaftPositionPresenter extends PositionPresenterTemplate<RaftPositionPresenterDataProps> {
  constructor(
    @Inject(RaftContractFactory) protected readonly contractFactory: RaftContractFactory,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super();
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    dataProps?: RaftPositionPresenterDataProps,
  ): MetadataItemWithLabel[] {

    const collateral = (balances[0] as ContractPositionBalance)?.tokens[0]
    const collateralUSD = collateral?.balanceUSD ?? 0;
    const debt = (balances[0] as ContractPositionBalance)?.tokens[1]?.balanceUSD ?? 0;
    const cRatio = Math.abs(debt) > 0 ? Math.abs(collateralUSD / debt) : 0;
    const liquidationPrice = dataProps?.minCRatio ? (dataProps.minCRatio * debt) / collateral.balance : 0

    return [
      { label: 'C-Ratio', ...buildPercentageDisplayItem(cRatio) },
      { label: 'Liquidation Price', ...buildDollarDisplayItem(liquidationPrice) },
    ];
  }
}
