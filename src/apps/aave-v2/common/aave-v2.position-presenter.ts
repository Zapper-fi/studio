import { Inject } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionDataPropsParams, PositionPresenterTemplate } from '~position/template/position-presenter.template';

import { AaveV2ContractFactory } from '../contracts';

export type AaveV2PositionPresenterDataProps = { healthFactor: number };

export abstract class AaveV2PositionPresenter extends PositionPresenterTemplate<AaveV2PositionPresenterDataProps> {
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

  async positionDataProps({
    address,
    groupLabel,
    balances,
  }: PositionDataPropsParams): Promise<AaveV2PositionPresenterDataProps | undefined> {
    if (groupLabel !== 'Lending') return;
    if (!balances.some(balance => balance.balanceUSD < 0)) return;

    const healthFactor = await this.getHealthFactor(address).then(v => Number(v) / 10 ** 18);
    return { healthFactor };
  }

  presentDataProps(dataProps: AaveV2PositionPresenterDataProps): MetadataItemWithLabel[] {
    return [{ label: 'Health Factor', value: dataProps.healthFactor, type: 'number' }];
  }
}
