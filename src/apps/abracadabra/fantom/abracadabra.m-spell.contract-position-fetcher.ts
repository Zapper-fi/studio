import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@Injectable()
export class FantomAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'mSPELL';
  mSpellAddress = '0xa668762fb20bcd7148db1bdb402ec06eb6dad569';
}
