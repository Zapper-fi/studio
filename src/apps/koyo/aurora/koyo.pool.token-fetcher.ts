import { Register } from '~app-toolkit/decorators';
import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';
import { Network } from '~types/network.interface';

import { KOYO_DEFINITION } from '../koyo.definition';

const appId = KOYO_DEFINITION.id;
const groupId = KOYO_DEFINITION.groups.pool.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraKoyoPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  appId = KOYO_DEFINITION.id;
  groupId = KOYO_DEFINITION.groups.pool.id;
  network = Network.AURORA_MAINNET;
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-aurora';
  vaultAddress = '0x0613adbd846cb73e65aa474b785f52697af04c0b';
  minLiquidity = 0;
}
