import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

export abstract class ExactlyPositionPresenter extends PositionPresenterTemplate {
  explorePresentationConfig = {
    tabs: [
      {
        label: 'Markets',
        viewType: 'split' as const,
        views: [
          {
            viewType: 'split' as const,
            label: 'Deposit',
            views: [
              { viewType: 'list' as const, label: 'Variable', groupIds: ['deposit'] },
              { viewType: 'list' as const, label: 'Fixed', groupIds: ['fixed-deposit'] },
            ],
          },
          {
            viewType: 'split' as const,
            label: 'Borrow',
            views: [
              { viewType: 'list' as const, label: 'Variable', groupIds: ['borrow'] },
              { viewType: 'list' as const, label: 'Fixed', groupIds: ['fixed-borrow'] },
            ],
          },
        ],
      },
    ],
  };
}
