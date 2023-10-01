import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2FarmContractPositionFetcher } from '../common/balancer-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class BaseBalancerV2FarmContractPositionFetcher extends BalancerV2FarmContractPositionFetcher {
  groupLabel = 'Staked';
  subgraphUrl = 'https://api.studio.thegraph.com/query/24660/balancer-gauges-base/version/latest';

  faultyRewardAddress = ['0x65226673f3d202e0f897c862590d7e1a992b2048'];
}
