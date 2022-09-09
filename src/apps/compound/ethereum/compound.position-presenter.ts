import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { CompoundPositionPresenter } from '../common/compound.position-presenter';
import { COMPOUND_DEFINITION } from '../compound.definition';

@Injectable()
export class EthereumCompoundPositionPresenter extends CompoundPositionPresenter {
  appId = COMPOUND_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
}
