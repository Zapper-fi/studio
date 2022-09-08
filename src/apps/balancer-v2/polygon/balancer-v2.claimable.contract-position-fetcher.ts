import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ClaimableContractPositionFetcher } from '../common/balancer-v2.claimable.contract-position-fetcher';

@Injectable()
export class PolygonBalancerV2ClaimableContractPositionFetcher extends BalancerV2ClaimableContractPositionFetcher {
  appId = BALANCER_V2_DEFINITION.id;
  groupId = BALANCER_V2_DEFINITION.groups.claimable.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Claimable';
}
