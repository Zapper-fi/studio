import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

@PresenterTemplate()
export class EthereumUwuLendPositionPresenter extends PositionPresenterTemplate {
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
            groupIds: ['variable-debt'],
          },
        ],
      },
      { viewType: 'list', label: 'Platform Fees V1', groupIds: ['platform-fees-v1'] },
      { viewType: 'list', label: 'Platform Fees V2', groupIds: ['platform-fees-v2'] },
    ],
  };
}
