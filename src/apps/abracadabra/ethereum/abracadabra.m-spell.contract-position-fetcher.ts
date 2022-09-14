import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@Injectable()
export class EthereumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'mSPELL';
  mSpellAddress = '0xbd2fbaf2dc95bd78cf1cd3c5235b33d1165e6797';
}
