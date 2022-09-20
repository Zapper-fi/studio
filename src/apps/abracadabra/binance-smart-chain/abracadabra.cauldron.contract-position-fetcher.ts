import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0x692cf15f80415d83e8c0e139cabcda67fcc12c90', // wBNB
    '0xf8049467f3a9d50176f4816b20cddd9bb8a93319', // CAKE
  ];
}
