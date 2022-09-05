import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@Injectable()
export class ArbitrumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.farm.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x839de324a1ab773f76a53900d70ac1b913d2b387';
}
