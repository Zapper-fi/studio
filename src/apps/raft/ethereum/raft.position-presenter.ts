import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { RaftDataProps } from '../common/raft.position.contract-position-fetcher';
import { RaftContractFactory } from '../contracts';

export const positionManagerAddress = '0x5f59b322eb3e16a0c78846195af1f588b77403fc';

@PresenterTemplate()
export class EthereumRaftPositionPresenter extends PositionPresenterTemplate {
  constructor(
    @Inject(RaftContractFactory) protected readonly contractFactory: RaftContractFactory,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super();
  }

  override metadataItemsForBalanceGroup(_groupLabel: string, balances: ReadonlyBalances): MetadataItemWithLabel[] {
    const balance = balances[0] as ContractPositionBalance<RaftDataProps>;
    const minCRatio = balance?.dataProps?.minCRatio;
    if (!minCRatio) return [];

    if (!balances.some(balance => balance.balanceUSD < 0)) return [];

    const collateral = balance?.tokens[0];
    const collateralUSD = collateral?.balanceUSD ?? 0;
    const debt = Math.abs(balance?.tokens[1]?.balanceUSD ?? 0);
    const cRatio = debt > 0 ? Math.abs(collateralUSD / debt) : 0;
    const liquidationPrice = (minCRatio * debt) / collateral.balance;

    return [
      { label: 'C-Ratio', ...buildPercentageDisplayItem(cRatio * 100) },
      { label: 'Liquidation Price', ...buildDollarDisplayItem(liquidationPrice) },
    ];
  }
}
