import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { lendingDataProps, LendingDataProps, presentLendingDataProps } from '~position/position-presenter.utils';
import { PositionDataPropsParams, PositionPresenterTemplate } from '~position/template/position-presenter.template';

export abstract class CompoundPositionPresenter extends PositionPresenterTemplate<LendingDataProps> {
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
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  };

  async positionDataProps({ balances, groupLabel }: PositionDataPropsParams): Promise<LendingDataProps | undefined> {
    if (groupLabel === 'Lending') {
      return lendingDataProps(balances);
    }
  }

  presentDataProps(dataProps: LendingDataProps): MetadataItemWithLabel[] {
    return presentLendingDataProps(dataProps);
  }
}
