import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class ArbitrumRadiantCapitalPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x2032b9a8e9f7e76768ca9271003d3e43e1616b1f';

  explorePresentationConfig: PresentationConfig = {
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
      { viewType: 'list', label: 'Platform Fees', groupIds: ['platform-fees'] },
      { viewType: 'list', label: 'Staking', groupIds: ['staking'] },
    ],
  };
}
