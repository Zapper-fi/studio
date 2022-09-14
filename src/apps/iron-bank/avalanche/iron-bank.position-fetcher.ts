import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import IRON_BANK_DEFINITION from '../iron-bank.definition';

@Injectable()
export class AvalancheIronBankPositionPresenter extends CompoundPositionPresenter {
  appId = IRON_BANK_DEFINITION.id;
  network = Network.AVALANCHE_MAINNET;
}
