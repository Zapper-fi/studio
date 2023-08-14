import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2PoolTokenFetcher } from '../common/balancer-v2.boosted.token-fetcher';

@PositionTemplate()
export class BaseBalancerV2BoostedTokenFetcher extends BalancerV2PoolTokenFetcher {
  groupLabel = 'Boosted';
  subgraphUrl = 'https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
}
