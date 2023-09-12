import { Inject } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MahalendContractFactory } from '../contracts';

export type MahalendPositionPresenterDataProps = { healthFactor: number };
export abstract class MahalendPositionPresenter extends PositionPresenterTemplate<MahalendPositionPresenterDataProps> {
  abstract lendingPoolAddress: string;

  constructor(@Inject(MahalendContractFactory) protected readonly aaveV2ContractFactory: MahalendContractFactory) {
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

  override async dataProps(address: string): Promise<MahalendPositionPresenterDataProps | undefined> {
    const lendingPoolContract = this.aaveV2ContractFactory.aaveV2LendingPoolProvider({
      network: this.network,
      address: this.lendingPoolAddress,
    });

    const lendingPoolUserData = await lendingPoolContract.getUserAccountData(address);
    const healthFactor = Number(lendingPoolUserData.healthFactor) / 10 ** 18;
    return { healthFactor };
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    balances: ReadonlyBalances,
    dataProps?: MahalendPositionPresenterDataProps,
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
