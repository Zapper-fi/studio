import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';

@Injectable()
export class EthereumAaveV2PositionPresenter extends AaveV2PositionPresenter {
  appId = AAVE_V2_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
  lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
}
