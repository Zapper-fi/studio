import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { BLIZZ_DEFINITION } from '../blizz.definition';

@Injectable()
export class AvalancheBlizzPositionPresenter extends AaveV2PositionPresenter {
  appId = BLIZZ_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;
  lendingPoolAddress = '0x70bbe4a294878a14cb3cdd9315f5eb490e346163';
}
