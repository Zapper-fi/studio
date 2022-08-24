import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { GEIST_DEFINITION } from '../geist.definition';

@Injectable()
export class FantomGeistPositionPresenter extends AaveV2PositionPresenter {
  appId = GEIST_DEFINITION.id;
  network = Network.FANTOM_OPERA_MAINNET;
  lendingPoolAddress = '0x9fad24f572045c7869117160a571b2e50b10d068';
}
