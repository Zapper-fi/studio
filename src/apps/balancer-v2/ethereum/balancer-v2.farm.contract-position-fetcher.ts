import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2FarmContractPositionFetcher } from '../common/balancer-v2.farm.contract-position-fetcher';

@Injectable()
export class EthereumBalancerV2FarmContractPositionFetcher extends BalancerV2FarmContractPositionFetcher {
  appId = BALANCER_V2_DEFINITION.id;
  groupId = BALANCER_V2_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Staked';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges';
}
