import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';

@Injectable()
export class PolygonAaveV2PositionPresenter extends AaveV2PositionPresenter {
  appId = AAVE_V2_DEFINITION.id;
  network = Network.POLYGON_MAINNET;
  lendingPoolAddress = '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf';
}
