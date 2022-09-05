import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@Injectable()
export class ArbitrumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'mSPELL';
  mSpellAddress = '0x1df188958a8674b5177f77667b8d173c3cdd9e51';
}
