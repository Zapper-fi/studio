import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { RariFusePositionPresenter } from '../common/rari-fuse.position-presenter';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Injectable()
export class EthereumRariFusePositionPresenter extends RariFusePositionPresenter {
  appId = RARI_FUSE_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;

  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: [RARI_FUSE_DEFINITION.groups.borrow.id, RARI_FUSE_DEFINITION.groups.supply.id],
    },
  ];
}
