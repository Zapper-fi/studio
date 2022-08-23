import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2PoolTokenFetcher } from '../common/balancer-v2.pool.token-fetcher';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumBalancerV2PoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  appId = BALANCER_V2_DEFINITION.id;
  groupId = BALANCER_V2_DEFINITION.groups.pool.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
}
