import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';

import { RariFusePositionPresenter } from '../common/rari-fuse.position-presenter';

@PresenterTemplate()
export class EthereumRariFusePositionPresenter extends RariFusePositionPresenter {
  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: ['borrow', 'supply'],
    },
  ];

  explorePresentationConfig: PresentationConfig = {
    tabs: [
      {
        label: 'Markets',
        viewType: 'dropdown',
        options: [
          {
            label: '{{ dataProps.marketName }}',
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
      },
    ],
  };
}
