import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@Injectable()
export class FantomAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.farm.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x37cf490255082ee50845ea4ff783eb9b6d1622ce';
}
