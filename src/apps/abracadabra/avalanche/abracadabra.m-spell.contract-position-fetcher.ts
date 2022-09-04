import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@Injectable()
export class AvalancheAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'mSPELL';
  mSpellAddress = '0xbd84472b31d947314fdfa2ea42460a2727f955af';
}
