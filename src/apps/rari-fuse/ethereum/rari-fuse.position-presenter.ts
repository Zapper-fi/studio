import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';

import { RariFusePositionPresenter } from '../common/rari-fuse.position-presenter';

@PresenterTemplate()
export class EthereumRariFusePositionPresenter extends RariFusePositionPresenter {
  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: ['borrow', 'supply'],
    },
  ];
}
