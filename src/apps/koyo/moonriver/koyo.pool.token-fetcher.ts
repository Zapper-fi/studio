import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';

@PositionTemplate()
export class MoonriverKoyoPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-moonriver';
  vaultAddress = '0xea1e627c12df4e054d61fd408ff7186353ac6ca1';
  minLiquidity = 0;
}
