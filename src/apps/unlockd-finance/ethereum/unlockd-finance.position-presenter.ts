import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

@PresenterTemplate()
export class EthereumUnlockdFinancePositionPresenter extends PositionPresenterTemplate {
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
            groupIds: ['variable-debt-2'],
          },
        ],
      },
    ],
  };
}
