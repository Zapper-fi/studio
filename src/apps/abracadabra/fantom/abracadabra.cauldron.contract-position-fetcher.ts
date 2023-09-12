import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  AbracadabraCauldronContractPositionDefinition,
  AbracadabraCauldronContractPositionFetcher,
} from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class FantomAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons: AbracadabraCauldronContractPositionDefinition[] = [
    { version: 'V2', type: 'REGULAR', address: '0x8e45af6743422e488afacdad842ce75a09eaed34' }, // wFTM
    { version: 'V2', type: 'REGULAR', address: '0xd4357d43545f793101b592bacab89943dc89d11b' }, // wFTM
    { version: 'V2', type: 'REGULAR', address: '0xed745b045f9495b8bfc7b58eea8e0d0597884e12' }, // yvFTM
    { version: 'V2', type: 'REGULAR', address: '0xa3fc1b4b7f06c2391f7ad7d4795c1cd28a59917e' }, // xBOO
    { version: 'V2', type: 'REGULAR', address: '0x7208d9f9398d7b02c5c22c334c2a7a3a98c0a45d' }, // FTM/MIM SpiritLP
    { version: 'V2', type: 'REGULAR', address: '0x4fdffa59bf8dda3f4d5b38f260eab8bfac6d7bc1' }, // FTM/MIM SpookyLP
  ];
}
