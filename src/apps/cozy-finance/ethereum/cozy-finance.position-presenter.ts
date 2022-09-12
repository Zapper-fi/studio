import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import COZY_FINANCE_DEFINITION from '../cozy-finance.definition';

@Injectable()
export class EthereumCozyFinancePositionPresenter extends CompoundPositionPresenter {
  appId = COZY_FINANCE_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
}
