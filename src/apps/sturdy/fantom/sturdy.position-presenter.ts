import { Inject, Injectable } from '@nestjs/common';

import { AaveV2ContractFactory } from '~apps/aave-v2';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import STURDY_DEFINITION from '../sturdy.definition';

@Injectable()
export class FantomSturdyPositionPresenter extends AaveV2PositionPresenter {
  constructor(@Inject(AaveV2ContractFactory) contractFactory: AaveV2ContractFactory) {
    super(contractFactory);
  }

  appId = STURDY_DEFINITION.id;
  network = Network.FANTOM_OPERA_MAINNET;
  lendingPoolAddress = '0x7ff2520cd7b76e8c49b5db51505b842d665f3e9a';
}
