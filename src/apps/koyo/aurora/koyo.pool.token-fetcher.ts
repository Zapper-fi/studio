import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';

@PositionTemplate()
export class AuroraKoyoPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-aurora';
  vaultAddress = '0x0613adbd846cb73e65aa474b785f52697af04c0b';
  minLiquidity = 0;
}
