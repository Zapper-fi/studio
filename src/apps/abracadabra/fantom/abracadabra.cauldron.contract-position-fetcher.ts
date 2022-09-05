import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@Injectable()
export class FantomAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0x8e45af6743422e488afacdad842ce75a09eaed34', // wFTM
    '0xd4357d43545f793101b592bacab89943dc89d11b', // wFTM
    '0xed745b045f9495b8bfc7b58eea8e0d0597884e12', // yvFTM
    '0xa3fc1b4b7f06c2391f7ad7d4795c1cd28a59917e', // xBOO
    '0x7208d9f9398d7b02c5c22c334c2a7a3a98c0a45d', // FTM/MIM SpiritLP
    '0x4fdffa59bf8dda3f4d5b38f260eab8bfac6d7bc1', // FTM/MIM SpookyLP
  ];
}
