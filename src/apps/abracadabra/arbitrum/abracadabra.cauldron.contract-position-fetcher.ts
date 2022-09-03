import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@Injectable()
export class ArbitrumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0xc89958b03a55b5de2221acb25b58b89a000215e6', // ETH
  ];
}
