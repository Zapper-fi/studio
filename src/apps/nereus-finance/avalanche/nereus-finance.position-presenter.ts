import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import NEREUS_FINANCE_DEFINITION from '../nereus-finance.definition';

@Injectable()
export class AvalancheNereusFinancePositionPresenter extends AaveV2PositionPresenter {
  appId = NEREUS_FINANCE_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;
  lendingPoolAddress = '0xb9257597eddfa0ecaff04ff216939fbc31aac026';
}
