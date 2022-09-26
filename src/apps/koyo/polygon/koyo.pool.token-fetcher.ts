import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';

@PositionTemplate()
export class PolygonKoyoPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-matic';
  vaultAddress = '0xacf8489ccb47da2d7306d827bbede05bfa6fea1b';
  minLiquidity = 0;
}
