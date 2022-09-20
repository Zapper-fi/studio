import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2PoolTokenFetcher } from '../common/balancer-v2.pool.token-fetcher';

@PositionTemplate()
export class PolygonBalancerV2PoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
}
