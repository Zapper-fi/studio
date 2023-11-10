import { Inject } from '@nestjs/common';

import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { ReflexerViemContractFactory } from '../contracts';

@PresenterTemplate()
export class EthereumReflexerPositionPresenter extends PositionPresenterTemplate {
  constructor(
    @Inject(ReflexerViemContractFactory) protected readonly aaveV2ContractFactory: ReflexerViemContractFactory,
  ) {
    super();
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    _dataProps?: DefaultDataProps | undefined,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Safes') {
      const collateral = (balances[0] as ContractPositionBalance)?.tokens[0]?.balanceUSD ?? 0;
      const debt = (balances[0] as ContractPositionBalance)?.tokens[1]?.balanceUSD ?? 0;
      const cRatio = Math.abs(debt) > 0 ? Math.abs(collateral / debt) : 0;

      return [
        {
          label: 'Collateral',
          value: collateral,
          type: 'dollar',
        },
        {
          label: 'Debt',
          value: debt,
          type: 'dollar',
        },
        {
          label: 'C-Ratio',
          value: cRatio,
          type: 'pct',
        },
      ];
    }

    return [];
  }
}
