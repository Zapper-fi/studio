import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { RariFusePositionPresenter } from '~apps/rari-fuse/common/rari-fuse.position-presenter';

@PresenterTemplate()
export class AvalancheMarketXyzPositionPresenter extends RariFusePositionPresenter {
  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: ['borrow', 'supply'],
    },
  ];
}
