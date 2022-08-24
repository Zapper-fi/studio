import { Inject, Injectable } from '@nestjs/common';

import { AaveV2ContractFactory } from '~apps/aave-v2';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';

@Injectable()
export class EthereumAaveAmmPositionPresenter extends AaveV2PositionPresenter {
  constructor(@Inject(AaveV2ContractFactory) contractFactory: AaveV2ContractFactory) {
    super(contractFactory);
  }

  appId = AAVE_AMM_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
  lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
  explorePresentationConfig = undefined;
}
