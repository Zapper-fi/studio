import { Injectable } from '@nestjs/common';

import { RariFusePositionPresenter } from '~apps/rari-fuse/common/rari-fuse.position-presenter';
import { Network } from '~types';

import MARKET_XYZ_DEFINITION from '../market-xyz.definition';

@Injectable()
export class AvalancheMarketXyzPositionPresenter extends RariFusePositionPresenter {
  appId = MARKET_XYZ_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;

  positionGroups = [
    {
      label: '{{ dataProps.marketName }}',
      groupIds: [MARKET_XYZ_DEFINITION.groups.borrow.id, MARKET_XYZ_DEFINITION.groups.supply.id],
    },
  ];
}
