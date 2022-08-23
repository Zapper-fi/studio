import { Inject, Injectable } from '@nestjs/common';

import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ContractFactory } from '../contracts';

@Injectable()
export class AvalancheAaveV2PositionPresenter extends AaveV2PositionPresenter {
  constructor(@Inject(AaveV2ContractFactory) contractFactory: AaveV2ContractFactory) {
    super(contractFactory);
  }

  appId = AAVE_V2_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;
  lendingPoolAddress = '0x4f01aed16d97e3ab5ab2b501154dc9bb0f1a5a2c';
}
