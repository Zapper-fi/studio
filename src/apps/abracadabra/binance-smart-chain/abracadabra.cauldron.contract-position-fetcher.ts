import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  AbracadabraCauldronContractPositionDefinition,
  AbracadabraCauldronContractPositionFetcher,
} from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons: AbracadabraCauldronContractPositionDefinition[] = [
    { version: 'V2', type: 'REGULAR', address: '0x692cf15f80415d83e8c0e139cabcda67fcc12c90' }, // wBNB
    { version: 'V2', type: 'REGULAR', address: '0xf8049467f3a9d50176f4816b20cddd9bb8a93319' }, // CAKE
  ];
}
