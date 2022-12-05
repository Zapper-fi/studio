import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { lendingDataProps, LendingDataProps, presentLendingDataProps } from '~position/position-presenter.utils';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

@PresenterTemplate()
export class AuroraBastionProtocolPositionPresenter extends PositionPresenterTemplate<LendingDataProps> {
  explorePresentationConfig: PresentationConfig = {
    tabs: [
      {
        label: 'Main Hub',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-main-hub'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-main-hub'],
          },
        ],
      },
      {
        label: 'Staked Near',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-staked-near'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-staked-near'],
          },
        ],
      },
      {
        label: 'Aurora Ecosystem',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-aurora-ecosystem'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-aurora-ecosystem'],
          },
        ],
      },
      {
        label: 'Multichain Realm',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply-multichain'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow-multichain'],
          },
        ],
      },
      {
        label: 'Stableswap Pools',
        viewType: 'list',
        groupIds: ['pool'],
      },
    ],
  };

  async positionDataProps({
    balances,
    groupLabel,
  }: {
    address: string;
    groupLabel: string;
    balances: ReadonlyBalances;
  }): Promise<LendingDataProps | undefined> {
    if (['Aurora Ecosystem Realm', 'Main Hub Realm', 'Multichain Realm', 'Staked NEAR Realm'].includes(groupLabel)) {
      return lendingDataProps(balances);
    }
  }

  presentDataProps(dataProps: LendingDataProps): MetadataItemWithLabel[] {
    return presentLendingDataProps(dataProps);
  }
}
