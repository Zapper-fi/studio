import { PositionPresenterTemplate } from '~position/template/position-presenter.template';

import { EXACTLY_DEFINITION } from '../exactly.definition';

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
              { viewType: 'list' as const, label: 'Variable', groupIds: [EXACTLY_DEFINITION.groups.deposit.id] },
              { viewType: 'list' as const, label: 'Fixed', groupIds: [EXACTLY_DEFINITION.groups.fixedDeposit.id] },
            ],
          },
          {
            viewType: 'split' as const,
            label: 'Borrow',
            views: [
              { viewType: 'list' as const, label: 'Variable', groupIds: [EXACTLY_DEFINITION.groups.borrow.id] },
              { viewType: 'list' as const, label: 'Fixed', groupIds: [EXACTLY_DEFINITION.groups.fixedBorrow.id] },
            ],
          },
        ],
      },
    ],
  };
}
