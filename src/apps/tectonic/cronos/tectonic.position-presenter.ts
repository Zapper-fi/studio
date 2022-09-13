import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import TECTONIC_DEFINITION from '../tectonic.definition';

@Injectable()
export class CronosTectonicPositionPresenter extends CompoundPositionPresenter {
  appId = TECTONIC_DEFINITION.id;
  network = Network.CRONOS_MAINNET;
}
