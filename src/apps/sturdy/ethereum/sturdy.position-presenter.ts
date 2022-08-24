import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import STURDY_DEFINITION from '../sturdy.definition';

@Injectable()
export class EthereumSturdyPositionPresenter extends AaveV2PositionPresenter {
  appId = STURDY_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
  lendingPoolAddress = '0xa422ca380bd70eef876292839222159e41aaee17';
}
