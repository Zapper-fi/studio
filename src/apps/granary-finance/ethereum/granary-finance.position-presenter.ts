import { Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import GRANARY_FINANCE_DEFINITION from '../granary-finance.definition';

@Injectable()
export class EthereumGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  appId = GRANARY_FINANCE_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
  lendingPoolAddress = '0xb702ce183b4e1faa574834715e5d4a6378d0eed3';
}
