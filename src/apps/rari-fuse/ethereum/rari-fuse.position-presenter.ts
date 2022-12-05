import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';

import { RariFusePositionPresenter } from '../common/rari-fuse.position-presenter';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@PresenterTemplate()
export class EthereumRariFusePositionPresenter extends RariFusePositionPresenter {
  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: [RARI_FUSE_DEFINITION.groups.borrow.id, RARI_FUSE_DEFINITION.groups.supply.id],
    },
  ];
}
