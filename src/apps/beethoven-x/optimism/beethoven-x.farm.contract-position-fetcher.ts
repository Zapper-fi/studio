import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXFarmContractPositionFetcher } from '../common/beethoven-x.farm.contract-position-fetcher';

@Injectable()
export class OptimismBeethovenXFarmContractPositionFetcher extends BeethovenXFarmContractPositionFetcher {
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.farm.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Farms';
  subgraphUrl = 'https://backend-optimism.beets-ftm-node.com/';
}
