import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import COZY_FINANCE_DEFINITION from '../cozy-finance.definition';

@Injectable()
export class ArbitrumCozyFinancePositionPresenter extends CompoundPositionPresenter {
  appId = COZY_FINANCE_DEFINITION.id;
  network = Network.ARBITRUM_MAINNET;
}
