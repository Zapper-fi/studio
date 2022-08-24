import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PresentationConfig } from '~app/app.interface';
import { AaveV2ContractFactory } from '~apps/aave-v2';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

export abstract class AaveV2PositionPresenter extends PositionPresenterTemplate {
  abstract lendingPoolAddress: string;

  constructor(@Inject(AaveV2ContractFactory) protected readonly aaveV2ContractFactory: AaveV2ContractFactory) {
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

  protected async getHealthFactor(address: string) {
    const lendingPoolContract = this.aaveV2ContractFactory.aaveV2LendingPoolProvider({
      network: this.network,
      address: this.lendingPoolAddress,
    });

    const lendingPoolUserData = await lendingPoolContract.getUserAccountData(address);
    return lendingPoolUserData.healthFactor;
  }

  @Register.BalanceProductMeta('Lending')
  async getLendingMeta(address: string, balances: ReadonlyBalances) {
    // When no debt, no health factor (pas de bras, pas de chocolat)
    if (!balances.some(balance => balance.balanceUSD < 0)) return [];
    const healthFactor = await this.getHealthFactor(address);

    return [
      {
        label: 'Health Factor',
        value: Number(healthFactor) / 10 ** 18,
        type: 'number',
      },
    ];
  }
}
