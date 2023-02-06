import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

export abstract class ImpermaxPositionPresenter extends PositionPresenterTemplate {
  explorePresentationConfig?: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['lend'],
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
}
