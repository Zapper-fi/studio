import { Inject } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { AaveV2ViemContractFactory } from '../contracts';

export type AaveV2PositionPresenterDataProps = { healthFactor: number };
export abstract class AaveV2PositionPresenter extends PositionPresenterTemplate<AaveV2PositionPresenterDataProps> {
  abstract lendingPoolAddress: string;

  constructor(@Inject(AaveV2ViemContractFactory) protected readonly contractFactory: AaveV2ViemContractFactory) {
    super();
  }

  explorePresentationConfig?: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'split',
            label: 'Borrow',
            views: [
              {
                viewType: 'list',
                label: 'Variable',
                groupIds: ['variable-debt'],
              },
              {
                viewType: 'list',
                label: 'Stable',
                groupIds: ['stable-debt'],
              },
            ],
          },
        ],
      },
    ],
  };

  override async dataProps(address: string): Promise<AaveV2PositionPresenterDataProps | undefined> {
    const lendingPoolContract = this.contractFactory.aaveV2LendingPoolProvider({
      network: this.network,
      address: this.lendingPoolAddress,
    });

    const lendingPoolUserData = await lendingPoolContract.read.getUserAccountData([address]);
    const healthFactor = Number(lendingPoolUserData[5]) / 10 ** 18;
    return { healthFactor };
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    dataProps?: AaveV2PositionPresenterDataProps,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Lending') {
      // When no debt, no health factor (pas de bras, pas de chocolat)
      if (!balances.some(balance => balance.balanceUSD < 0)) return [];
      if (!dataProps) return [];

      const { healthFactor } = dataProps;

      return [
        {
          label: 'Health Factor',
          value: healthFactor,
          type: 'number',
        },
      ];
    }

    return [];
  }
}
