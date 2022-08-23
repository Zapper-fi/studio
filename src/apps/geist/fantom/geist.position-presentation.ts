import { Inject, Injectable } from '@nestjs/common';

import { AaveV2ContractFactory } from '~apps/aave-v2';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { GEIST_DEFINITION } from '../geist.definition';

@Injectable()
export class FantomGeistPositionPresenter extends AaveV2PositionPresenter {
  constructor(@Inject(AaveV2ContractFactory) contractFactory: AaveV2ContractFactory) {
    super(contractFactory);
  }

  appId = GEIST_DEFINITION.id;
  network = Network.FANTOM_OPERA_MAINNET;
  lendingPoolAddress = '0x9fad24f572045c7869117160a571b2e50b10d068';
}
