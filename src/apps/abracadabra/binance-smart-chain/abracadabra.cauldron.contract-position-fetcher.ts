import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@Injectable()
export class BinanceSmartChainAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0x692cf15f80415d83e8c0e139cabcda67fcc12c90', // wBNB
    '0xf8049467f3a9d50176f4816b20cddd9bb8a93319', // CAKE
  ];
}
