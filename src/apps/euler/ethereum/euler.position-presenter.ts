import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

@PresenterTemplate()
export class EthereumEulerPositionPresenter extends PositionPresenterTemplate {
  explorePresentationConfig?: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['e-token'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['d-token'],
          },
        ],
      },
      { viewType: 'list', label: 'Farms', groupIds: ['single-staking-farm'] },
    ],
  };
}
