import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class OptimismStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.farm.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x4a364f8c717caad9a442737eb7b8a55cc6cf18d8';
}
