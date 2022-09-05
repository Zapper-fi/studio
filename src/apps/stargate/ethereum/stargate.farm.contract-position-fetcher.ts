import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class EthereumStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0xb0d502e938ed5f4df2e681fe6e419ff29631d62b';
}
