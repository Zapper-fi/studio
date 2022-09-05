import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import GRANARY_FINANCE_DEFINITION from '../granary-finance.definition';

@Injectable()
export class OptimismGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  appId = GRANARY_FINANCE_DEFINITION.id;
  network = Network.OPTIMISM_MAINNET;
  lendingPoolAddress = '0x8fd4af47e4e63d1d2d45582c3286b4bd9bb95dfe';
}
