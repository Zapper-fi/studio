import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class AvalancheStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.farm.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x8731d54e9d02c286767d56ac03e8037c07e01e98';
}
