import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

@Injectable()
export class EthereumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0xf43480afe9863da4acbd4419a47d9cc7d25a647f';
}
