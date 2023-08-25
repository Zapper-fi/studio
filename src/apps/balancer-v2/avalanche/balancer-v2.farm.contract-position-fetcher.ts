import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2FarmContractPositionFetcher } from '../common/balancer-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheBalancerV2FarmContractPositionFetcher extends BalancerV2FarmContractPositionFetcher {
  groupLabel = 'Staked';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-avalanche?source=zapper';
}
