import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@Injectable()
export class AvalancheAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.farm.id;
  network = Network.AVALANCHE_MAINNET;

  groupLabel = 'Farms';
  chefAddress = '0x06408571e0ad5e8f52ead01450bde74e5074dc74';
}
