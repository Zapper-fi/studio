import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2StakedContractPositionFetcher } from '../common/balancer-v2.staked.contract-position-fetcher';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonBalancerV2StakedContractPositionFetcher extends BalancerV2StakedContractPositionFetcher {
  appId = BALANCER_V2_DEFINITION.id;
  groupId = BALANCER_V2_DEFINITION.groups.farm.id;
  network = Network.POLYGON_MAINNET;
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-polygon';
}
