import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import AURIGAMI_DEFINITION from '../aurigami.definition';

@Injectable()
export class AuroraAurigamiPositionPresenter extends CompoundPositionPresenter {
  appId = AURIGAMI_DEFINITION.id;
  network = Network.AURORA_MAINNET;
}
