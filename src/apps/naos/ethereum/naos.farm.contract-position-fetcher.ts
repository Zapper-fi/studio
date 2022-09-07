import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { NaosFarmContractPositionFetcher } from '../common/naos.farm.contract-position-fetcher';
import { NAOS_DEFINITION } from '../naos.definition';

@Injectable()
export class EthereumNaosFarmContractPositionFetcher extends NaosFarmContractPositionFetcher {
  appId = NAOS_DEFINITION.id;
  groupId = NAOS_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Staking';
  chefAddress = '0x99e4ea9ef6bf396c49b35ff9478ebb8890aef581';
}
