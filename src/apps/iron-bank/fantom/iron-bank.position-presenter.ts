import { Injectable } from '@nestjs/common';

import { CompoundPositionPresenter } from '~apps/compound/common/compound.position-presenter';
import { Network } from '~types';

import IRON_BANK_DEFINITION from '../iron-bank.definition';

@Injectable()
export class FantomIronBankPositionPresenter extends CompoundPositionPresenter {
  appId = IRON_BANK_DEFINITION.id;
  network = Network.FANTOM_OPERA_MAINNET;
}
