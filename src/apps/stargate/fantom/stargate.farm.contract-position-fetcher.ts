import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { STARGATE_DEFINITION } from '../stargate.definition';

@Injectable()
export class FantomStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  appId = STARGATE_DEFINITION.id;
  groupId = STARGATE_DEFINITION.groups.farm.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x224d8fd7ab6ad4c6eb4611ce56ef35dec2277f03';
}
